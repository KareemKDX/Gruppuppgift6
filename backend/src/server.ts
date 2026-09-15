import express from "express";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

let app = express();

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());

app.get("/test", async (req, res) => {
  const result = await pool.query("Select * from Subscriptions");
  res.json(result.rows);
});

app.get("/", (req, res) => {
  res.json({ message: "MusicPlate backend is running!" });
});

app.listen(4001, () => {
  console.log("MusicPlate backend started on port 4001");
});
