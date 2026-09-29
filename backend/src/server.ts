import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db";
import authRouter from "./routes/auth";
import { authenticateToken } from "./middleware/auth";
import { requireAdmin } from "./middleware/require-admin";
import {
  getSongs,
  addSong,
  updateReleaseType,
  getSongById,
} from "./routes/song-routes";
import { getContentPages, addContentPage } from "./routes/content-routes";
import { createCheckout, getReceipts } from "./routes/receipt-routes";
import profileRouter from "./routes/profile-routes";
import subscriptionRouter from "./routes/subscription-routes";
import playlistRouter from "./routes/playlist-routes";

let app = express();

// adressen till frontend kommer från miljön när sidan är deployad
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// porten sätts av servern vi kör på annars kör vi 4001 lokalt
const port = Number(process.env.PORT) || 4001;

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.use("/auth", authRouter);

//User
app.use("/api", profileRouter);
app.use("/api", subscriptionRouter);
app.use("/api", playlistRouter);
app.get("/api/songs/:id", authenticateToken, getSongById);

app.get("/api/songs", getSongs);
app.post("/api/songs", authenticateToken, requireAdmin, addSong);
app.patch("/api/songs/:id", authenticateToken, requireAdmin, updateReleaseType);
app.get("/api/content-pages", getContentPages);
app.post("/api/content-pages", authenticateToken, requireAdmin, addContentPage);
app.post("/api/checkout", authenticateToken, createCheckout);
app.get("/api/receipts", authenticateToken, getReceipts);

app.get("/test", async (req, res) => {
  const result = await pool.query("Select * from Subscriptions");
  res.json(result.rows);
});

app.get("/", (req, res) => {
  res.json({ message: "MusicPlate backend is running!" });
});

app.listen(port, () => {
  console.log(`MusicPlate backend started on port ${port}`);
});