import { Request, Response } from "express";
import { pool } from "../db";

// hämtar alla innehållssidor, nyaste först
export const getContentPages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM content_pages ORDER BY created_at DESC, id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte hämta innehållssidor" });
  }
};