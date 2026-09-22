import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db";
import authRouter from "./routes/auth";
import { getSongs, addSong, updateReleaseType } from "./routes/song-routes";
import { getContentPages } from "./routes/content-routes";
import profileRouter from "./routes/profile-routes";
import subscriptionRouter from "./routes/subscription-routes";

let app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api", subscriptionRouter);

app.get("/api/songs", getSongs);
app.post("/api/songs", addSong);
app.patch("/api/songs/:id", updateReleaseType);
app.get("/api/content-pages", getContentPages);
app.get("/test", async (req, res) => {
  const result = await pool.query("Select * from Subscriptions");
  res.json(result.rows);
});

app.get("/", (req, res) => {
  res.json({ message: "MusicPlate backend is running!" });
});

app.listen(4001, () => {
  console.log("MusicPlate backend started on port 4001");
});