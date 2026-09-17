import { Request, Response } from "express";
import { pool } from "../db";

// hämtar alla låtar från databasen
export const getSongs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM songs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte hämta låtar" });
  }
};