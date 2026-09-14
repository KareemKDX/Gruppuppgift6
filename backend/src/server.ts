import express from "express";

let app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "MusicPlate backend is running!" });
});

app.listen(4001, () => {
  console.log("MusicPlate backend started on port 4001");
});
