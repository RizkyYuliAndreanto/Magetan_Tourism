const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes"); // Ini penting!
const beritaRoutes = require("./src/routes/beritaRoutes"); // Ini penting!
const kategoriBeritaRoutes = require("./src/routes/kategoriBeritaRoutes"); // Ini penting!
const destinasiRoutes = require("./src/routes/destinasiRoutes"); // Ini penting!
const kategoriDestinasiRoutes = require("./src/routes/kategoriDestinasiRoutes"); // Ini penting!

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/kategori-berita", kategoriBeritaRoutes);
app.use("/api/destinasi", destinasiRoutes);
app.use("/api/kategori-destinasi", kategoriDestinasiRoutes);

// Middleware penanganan kesalahan umum
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ada yang tidak beres!");
});

module.exports = app; // Ekspor instance 'app' yang sudah dikonfigurasi
