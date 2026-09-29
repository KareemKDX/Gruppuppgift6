import dotenv from "dotenv";
import pg from "pg";

// läser in .env innan poolen skapas
dotenv.config();

const { Pool } = pg;

// i molnet får vi en färdig adress till databasen lokalt bygger vi ihop den själva
export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });