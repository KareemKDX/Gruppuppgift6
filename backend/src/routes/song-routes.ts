import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../db";

// regler för vad en ny låt måste innehålla
const NewSongSchema = z.object({
  artist: z.string().min(1),
  title: z.string().min(1),
  album: z.string().optional(),
  duration: z.number().int().positive(),
  release_type: z.enum(["released", "early_access"]),
});

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

// lägger till en ny låt i databasen
export const addSong = async (req: Request, res: Response) => {
  const validation = NewSongSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: "Felaktig data", details: validation.error.issues });
  }

  const song = validation.data;

  try {
    const result = await pool.query(
      "INSERT INTO songs (artist, title, album, duration, release_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [song.artist, song.title, song.album, song.duration, song.release_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte lägga till låt" });
  }
};