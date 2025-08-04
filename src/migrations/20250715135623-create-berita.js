// src/migrations/20250715135623-create-berita.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Nama tabel disesuaikan agar konsisten dengan model
    await queryInterface.createTable("Beritas", {
      id_berita: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teras_berita: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isi_berita: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      penutup_berita: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tanggal_publikasi: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gambar_hero_berita: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      koordinat_lokasi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zoom_level_peta: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      jumlah_share: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      id_kategori: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // KOREKSI: Merujuk ke nama tabel yang benar: 'Kategori_Beritas'
        references: {
          model: "Kategori_Beritas",
          key: "id_kategori",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Admins",
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Beritas");
  },
};
