// <timestamp>-create-struktur-organisasi.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Struktur_Organisasis", {
      id_struktur_organisasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul_struktur: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Struktur Organisasi",
      },
      deskripsi_struktur: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      gambar_struktur_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tanggal_pembaruan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Admins", // Nama tabel Admins yang benar (jamak)
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Atau 'SET NULL' jika id_admin di model boleh null
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Struktur_Organisasis");
  },
};
