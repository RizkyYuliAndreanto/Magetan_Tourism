const dotenv = require("dotenv");
dotenv.config();

const app = require("./app.js"); // Impor instance 'app' yang sudah dikonfigurasi
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 5000;

// Test koneksi database tanpa sync (karena kita menggunakan migration)
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Koneksi database berhasil!");
    app.listen(PORT, () => {
      // Gunakan instance 'app' yang diimpor
      console.log(`🚀 Server berjalan di port ${PORT}`);
      console.log(
        `🌐 Frontend URL origin: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Gagal terhubung ke database:", err);
    process.exit(1);
  });
