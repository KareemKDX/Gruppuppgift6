import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../db";

// regler för vad en ny innehållssida måste innehålla
const NewContentPageSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  required_subscription_id: z.number().int().positive(),
});

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

// lägger till en ny innehållssida i databasen
export const addContentPage = async (req: Request, res: Response) => {
  const validation = NewContentPageSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Felaktig data", details: validation.error.issues });
  }

  const page = validation.data;

  try {
    const result = await pool.query(
      "INSERT INTO content_pages (title, content, required_subscription_id) VALUES ($1, $2, $3) RETURNING *",
      [page.title, page.content, page.required_subscription_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte lägga till innehållssida" });
  }
};