import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/validate", async (req, res) => {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    const response = await fetch(
      `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}&out=json`,
      {
        headers: {
          "User-Agent": "LocalValidator/1.0",
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );

    if (!response.ok)
      throw new Error(`Validator API returned ${response.status}`);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ error: "Failed to validate URL" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
