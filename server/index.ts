import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import validateRouter from "./validate";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API routes
app.use("/api", validateRouter);

// Serve built frontend (after Vite build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../../dist");
app.use(express.static(clientPath));

app.get("*", (_, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
