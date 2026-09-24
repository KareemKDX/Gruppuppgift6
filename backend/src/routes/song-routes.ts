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

// regler för när man ändrar om en låt är släppt eller early access
const ReleaseTypeSchema = z.object({
  release_type: z.enum(["released", "early_access"]),
});

// hämtar alla låtar från databasen, nyaste först
export const getSongs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY created_at DESC, id DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte hämta låtar" });
  }
};

//FETCH SONG BY ID AND CHECK USER SUBSCRIPTION CONDITIONS
export const getSongById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
    const song = result.rows[0];
    console.log("getSongById Called");
    console.log("song.release value:", JSON.stringify(song.release_type));

    if (!song) {
      return res
        .status(404)
        .json({ error: "Couldn't find song with id: " + id });
    }

    if (song.release_type === "early_access") {
      const userResult = await pool.query(
        `SELECT subscriptions.early_access
         FROM users
         JOIN subscriptions ON users.subscription_id = subscriptions.id
         WHERE users.id = $1`,
        [req.user!.id],
      );

      const hasEarlyAccess = userResult.rows[0]?.early_access === true;
      console.log("early access: " + hasEarlyAccess);

      if (!hasEarlyAccess) {
        return res
          .status(403)
          .json({ error: "User doesn't have early access subscription." });
      }
    }

    res.json(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching song" });
  }
};

// lägger till en ny låt i databasen
export const addSong = async (req: Request, res: Response) => {
  const validation = NewSongSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Felaktig data", details: validation.error.issues });
  }

  const song = validation.data;

  try {
    const result = await pool.query(
      "INSERT INTO songs (artist, title, album, duration, release_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [song.artist, song.title, song.album, song.duration, song.release_type],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte lägga till låt" });
  }
};

// ändrar om en låt är släppt eller early access
export const updateReleaseType = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const validation = ReleaseTypeSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "Felaktig data", details: validation.error.issues });
  }

  const releaseType = validation.data.release_type;

  try {
    const result = await pool.query(
      "UPDATE songs SET release_type = $1 WHERE id = $2 RETURNING *",
      [releaseType, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Låten finns inte" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kunde inte ändra låten" });
  }
};
