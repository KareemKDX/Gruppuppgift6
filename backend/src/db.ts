import dotenv from "dotenv";
import pg from "pg";

// läser in .env innan poolen skapas
dotenv.config();

const { Pool } = pg;

// en gemensam pool för hela backend
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});