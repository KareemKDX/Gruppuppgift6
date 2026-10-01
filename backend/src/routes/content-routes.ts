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
      `SELECT content_pages.id, content_pages.title, content_pages.required_subscription_id, 
       subscriptions.name AS required_subscription_name
       FROM content_pages JOIN subscriptions ON subscriptions.id = content_pages.required_subscription_id
       ORDER BY content_pages.created_at DESC, content_pages.id DESC`
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

const PageIdSchema = z.coerce.number().int().positive().max(2147483647);

export const getContentPage = async (req: Request, res: Response) => {
  const id = PageIdSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(404).json({ error: "Innehållssidan finns inte" });
  }

  try {
    const result = await pool.query(
      `SELECT content_pages.id, content_pages.title, content_pages.content, required.name AS required_subscription_name,
       (users.role = 'admin' OR own.price >= required.price) AS allowed FROM content_pages
       JOIN subscriptions required ON required.id = content_pages.required_subscription_id JOIN users ON users.id = $2
       LEFT JOIN subscriptions own ON own.id = users.subscription_id WHERE content_pages.id = $1`,
      [id.data, req.user!.id]
    );
    const page = result.rows[0];

    if (!page) {
      return res.status(404).json({ error: "Innehållssidan finns inte" });
    }

    if (!page.allowed) {
      return res.status(403).json({
        error: `Du behöver ${page.required_subscription_name} för att läsa den här sidan`,
        title: page.title,
      });
    }

    res.json({ id: page.id, title: page.title, content: page.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte hämta innehållssidan" });
  }
};
