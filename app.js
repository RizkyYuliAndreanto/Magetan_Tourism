const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes"); // Ini penting!
const beritaRoutes = require("./src/routes/beritaRoutes"); // Ini penting!
const kategoriBeritaRoutes = require("./src/routes/kategoriBeritaRoutes"); // Ini penting!
const destinasiRoutes = require("./src/routes/destinasiRoutes"); // Ini penting!
const kategoriDestinasiRoutes = require("./src/routes/kategoriDestinasiRoutes"); // Ini penting!
const eventRoutes = require("./src/routes/eventRoutes"); // Ini penting!
const sejarahRoutes = require("./src/routes/sejarahRoutes"); // Ini penting!
const umkmRoutes = require("./src/routes/umkmRoutes"); // Ini penting!
const mediaGaleriRoutes = require("./src/routes/mediaGaleriRoutes"); // Ini penting!
const strukturAnggotaRoutes = require("./src/routes/strukturAnggotaRoutes"); // Ini penting!
const pengumumanRoutes = require("./src/routes/pengumumanRoutes"); // Ini penting!
const visiMisiRoutes = require("./src/routes/visiMisiRoutes"); // Ini penting!
const strukturOrganisasiRoutes = require("./src/routes/strukturOrganisasiRoutes"); // Ini penting!
const akomodasiRoutes = require("./src/routes/akomodasiRoutes"); // Ini penting!
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
app.use("/api/event", eventRoutes);
app.use("/api/sejarah", sejarahRoutes);
app.use("/api/umkm", umkmRoutes)
app.use("/api/media-galeri", mediaGaleriRoutes);
app.use("/api/struktur-anggota", strukturAnggotaRoutes);
app.use("/api/pengumuman", pengumumanRoutes)
app.use("/api/visi-misi", visiMisiRoutes);
app.use("/api/struktur-organisasi", strukturOrganisasiRoutes);
app.use("/api/akomodasi", akomodasiRoutes);


// Middleware penanganan kesalahan umum
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ada yang tidak beres!");
});

module.exports = app; // Ekspor instance 'app' yang sudah dikonfigurasi
