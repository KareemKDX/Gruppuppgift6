import { Router } from "express";
import { pool } from "../db";
import { authenticateToken } from "../middleware/auth";

const router = Router();

const toId = (value: unknown) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const findPlaylist = async (rawId: unknown, userId: number) => {
  const id = toId(rawId);
  if (!id) return undefined;

  const result = await pool.query(
    "SELECT id, name, created_at FROM playlists WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return result.rows[0];
};

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

router.get("/playlists/:id", authenticateToken, async (req, res) => {
  const playlist = await findPlaylist(req.params.id, req.user!.id);

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const songs = await pool.query(
    `SELECT songs.* FROM playlist_songs JOIN songs ON songs.id = playlist_songs.song_id
     WHERE playlist_songs.playlist_id = $1 ORDER BY songs.artist, songs.title`,
    [playlist.id]
  );

  res.json({ playlist: { ...playlist, songs: songs.rows } });
});

router.delete("/playlists/:id", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "DELETE FROM playlists WHERE id = $1 AND user_id = $2",
    [toId(req.params.id), req.user!.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  res.sendStatus(204);
});

router.post("/playlists/:id/songs", authenticateToken, async (req, res) => {
  const songId = toId(req.body?.song_id);

  if (!songId) {
    return res.status(400).json({ message: "song_id is required" });
  }

  const playlist = await findPlaylist(req.params.id, req.user!.id);

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const song = await pool.query("SELECT release_type FROM songs WHERE id = $1", [songId]);

  if (!song.rows[0]) {
    return res.status(404).json({ message: "Song not found" });
  }

  if (song.rows[0].release_type === "early_access") {
    const sub = await pool.query(
      `SELECT subscriptions.early_access FROM users JOIN subscriptions ON users.subscription_id = subscriptions.id WHERE users.id = $1`,
      [req.user!.id]
    );

    if (!sub.rows[0]?.early_access) {
      return res.status(403).json({ message: "Early access songs require a subscription with early access" });
    }
  }

  const result = await pool.query(
    "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [playlist.id, songId]
  );

  if (result.rowCount === 0) {
    return res.status(409).json({ message: "Song is already in the playlist" });
  }

  res.status(201).json({ message: "Song added to playlist" });
});

router.delete("/playlists/:id/songs/:songId", authenticateToken, async (req, res) => {
  const playlist = await findPlaylist(req.params.id, req.user!.id);

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const result = await pool.query(
    "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
    [playlist.id, toId(req.params.songId)]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Song is not in the playlist" });
  }

  res.sendStatus(204);
});

export default router;
