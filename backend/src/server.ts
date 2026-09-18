import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db";
import { getSongs } from "./routes/song-routes";
import authRouter from "./routes/auth";

let app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.get("/api/songs", getSongs);
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
