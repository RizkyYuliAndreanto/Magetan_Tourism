// seeders/adminSeeder.js
require("dotenv").config(); // Pastikan dotenv dimuat untuk mengakses process.env
const bcrypt = require("bcryptjs");
const { Admin } = require("../models"); // Sesuaikan path ke model Admin Anda

async function seedAdminAndUserAccounts() {
  try {
    // Hash password untuk super admin
    const hashedPasswordSuperAdmin = await bcrypt.hash("superadmin123", 10);
    // Hash password untuk admin biasa
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
    // Hash password untuk user biasa
    const hashedPasswordUser = await bcrypt.hash("user123", 10);

    // Data akun yang akan di-seed
    const accountsToSeed = [
      {
        username: "superadmin",
        password: hashedPasswordSuperAdmin,
        nama_lengkap: "Super Administrator",
        email: "superadmin@example.com",
        level_akses: "superadmin",
      },
      {
        username: "admin",
        password: hashedPasswordAdmin,
        nama_lengkap: "Administrator Biasa",
        email: "admin@example.com",
        level_akses: "admin",
      },
      {
        username: "userbiasa",
        password: hashedPasswordUser,
        nama_lengkap: "Pengguna Umum",
        email: "user@example.com",
        level_akses: "user",
      },
    ];

    for (const accountData of accountsToSeed) {
      const existingAccount = await Admin.findOne({
        where: { username: accountData.username },
      });
      if (!existingAccount) {
        await Admin.create(accountData);
        console.log(
          `${accountData.level_akses} account '${accountData.username}' seeded successfully.`
        );
      } else {
        console.log(
          `${accountData.level_akses} account '${accountData.username}' already exists.`
        );
      }
    }
  } catch (error) {
    console.error("Error seeding accounts:", error);
  } finally {
    // Tutup koneksi database jika diperlukan, tergantung ORM yang Anda gunakan
    const sequelize = require("../models").sequelize; // Sesuaikan path jika berbeda
    if (sequelize) {
      await sequelize.close();
      console.log("Database connection closed.");
    }
  }
}

seedAdminAndUserAccounts();
