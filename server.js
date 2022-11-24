import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const port = 8383;

const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.get("/info", (req, res) => {
  res.status(200).json({ text: `${apiKey}` });
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
