const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes"); // Ini penting!

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

// Middleware penanganan kesalahan umum
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ada yang tidak beres!");
});

module.exports = app; // Ekspor instance 'app' yang sudah dikonfigurasi
