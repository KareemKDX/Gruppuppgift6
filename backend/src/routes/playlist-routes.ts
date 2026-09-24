import { Router } from "express";
import { pool } from "../db";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/playlists", authenticateToken, async (req, res) => {
  const result = await pool.query(
    `SELECT playlists.id, playlists.name, playlists.created_at, COUNT(playlist_songs.song_id)::int AS song_count
     FROM playlists LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id WHERE playlists.user_id = $1
     GROUP BY playlists.id ORDER BY playlists.created_at`,
    [req.user!.id]
  );

  res.json({ playlists: result.rows });
});

router.post("/playlists", authenticateToken, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

  if (!name || name.length > 150) {
    return res.status(400).json({ message: "name is required (max 150 characters)" });
  }

  const limit = await pool.query(
    `SELECT subscriptions.playlist_limit, (SELECT COUNT(*)::int FROM playlists WHERE user_id = users.id) AS playlist_count
     FROM users JOIN subscriptions ON users.subscription_id = subscriptions.id WHERE users.id = $1`,
    [req.user!.id]
  );
  const sub = limit.rows[0];

  if (!sub || sub.playlist_count >= sub.playlist_limit) {
    return res.status(403).json({ message: "Playlist limit reached, upgrade your subscription to create more" });
  }

  const result = await pool.query(
    "INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING id, name, created_at",
    [name, req.user!.id]
  );

  res.status(201).json({ playlist: { ...result.rows[0], song_count: 0 } });
});

export default router;
