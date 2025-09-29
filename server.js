// server.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve all static files in public/
app.use(express.static(path.join(__dirname, "public")));

// Optionally, redirect "/" to "index.html"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
