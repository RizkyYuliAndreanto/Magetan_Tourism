"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek apakah sudah ada super admin
    const existingSuperAdmin = await queryInterface.rawSelect(
      "Admins",
      {
        where: {
          level_akses: "superadmin",
        },
      },
      ["id_admin"]
    );

    // Jika belum ada super admin, buat yang pertama
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash("superadmin123", 12);

      await queryInterface.bulkInsert("Admins", [
        {
          username: "superadmin",
          password: hashedPassword,
          nama_lengkap: "Super Administrator",
          email: "superadmin@magetan.go.id",
          level_akses: "superadmin",
          is_blocked: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      console.log("✅ Super Admin created successfully!");
      console.log("📋 Login credentials:");
      console.log(
        "   Username/Email: superadmin atau superadmin@magetan.go.id"
      );
      console.log("   Password: superadmin123");
      console.log("⚠️  Please change the password after first login!");
    } else {
      console.log("ℹ️  Super Admin already exists, skipping creation.");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Admins",
      {
        username: "superadmin",
      },
      {}
    );
  },
};
