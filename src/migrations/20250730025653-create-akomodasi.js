// 20250730025653-create-akomodasi.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Akomodasis", {
      id_akomodasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_hotel: {
        type: Sequelize.STRING,
        allowNull: false, // KOREKSI: Tambahkan allowNull
      },
      deskripsi_hotel: {
        type: Sequelize.TEXT,
        allowNull: false, // KOREKSI: Tambahkan allowNull
      },
      alamat_hotel: {
        type: Sequelize.TEXT,
        allowNull: false, // KOREKSI: Tambahkan allowNull
      },
      koordinat_lokasi: {
        type: Sequelize.STRING,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      fasilitas: {
        type: Sequelize.TEXT,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      gambar_utama_hotel: {
        type: Sequelize.STRING,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      kontak_hotel: {
        type: Sequelize.STRING,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      website_hotel: {
        type: Sequelize.STRING,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      rating_hotel: {
        type: Sequelize.DECIMAL(2, 1), // KOREKSI: Tambahkan presisi dan skala
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // KOREKSI: Tambahkan defaultValue
      },
      jumlah_share: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // KOREKSI: Tambahkan defaultValue
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: false, // KOREKSI: Tambahkan allowNull
        references: {
          // KOREKSI: Tambahkan referensi kunci asing
          model: "Admins", // Pastikan nama tabel Admins sudah benar (jamak)
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Sesuaikan dengan kebutuhan Anda ('CASCADE', 'SET NULL', 'RESTRICT')
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
    await queryInterface.dropTable("Akomodasis");
  },
};
