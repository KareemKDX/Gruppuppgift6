import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { authenticateToken } from "../middleware/auth";

const router = Router();

const BASIC_SUBSCRIPTION_ID = 1;
const SALT_ROUNDS = 10;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret missing");
  }
  return secret;
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email and password are required" });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (username, email, password, subscription_id, role) VALUES ($1, $2, $3, $4, 'customer')
     RETURNING id, username, email, subscription_id, role, created_at`,
    [username, email, passwordHash, BASIC_SUBSCRIPTION_ID]
  );

  const user = result.rows[0];
  const token = jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), { expiresIn: "7d" });

  res.status(201).json({ token, user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const result = await pool.query(
    "SELECT id, username, email, password, subscription_id, role FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), { expiresIn: "7d" });
  delete user.password;

  res.json({ token, user });
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

router.get("/me", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "SELECT id, username, email, subscription_id, role, created_at FROM users WHERE id = $1",
    [req.user!.id]
  );
  const user = result.rows[0];
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
});

export default router;