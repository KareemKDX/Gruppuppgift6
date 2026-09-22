import { Router } from "express";
import { pool } from "../db";
import { authenticateToken } from "../middleware/auth";

const router = Router();

//FETCH ALL PROFILE INFO
router.get("/profile", authenticateToken, async (req, res) => {
  console.log("profile router loaded");
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.email, users.role, users.created_at,
              subscriptions.id AS subscription_id, subscriptions.name AS subscription_name,
              subscriptions.price, subscriptions.early_access, subscriptions.playlist_limit
       FROM users
       JOIN subscriptions ON users.subscription_id = subscriptions.id
       WHERE users.id = $1`,
      [req.user!.id],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
