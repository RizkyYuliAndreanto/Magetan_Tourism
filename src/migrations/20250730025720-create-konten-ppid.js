// <timestamp>-create-konten-ppid.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Konten_PPIDs", {
      id_konten_ppid: {
        // KOREKSI: Ubah 'id' menjadi 'id_konten_ppid'
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul_konten: {
        type: Sequelize.STRING,
        allowNull: false, // KOREKSI: Tambahkan allowNull
      },
      deskripsi_konten: {
        type: Sequelize.TEXT,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      file_pdf_path: {
        type: Sequelize.STRING,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      tanggal_publikasi: {
        type: Sequelize.DATE,
        allowNull: false, // KOREKSI: Tambahkan allowNull
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // KOREKSI: Tambahkan defaultValue
      },
      id_kategori_ppid: {
        type: Sequelize.INTEGER,
        allowNull: false, // KOREKSI: Tambahkan allowNull
        references: {
          // KOREKSI: Tambahkan referensi kunci asing
          model: "Kategori_PPIDs", // Pastikan nama tabel Kategori_PPIDs sudah benar (jamak)
          key: "id_kategori_ppid",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
        onDelete: "RESTRICT",
      },
      created_at: {
        // KOREKSI: Pastikan nama kolom 'created_at' (underscored)
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        // KOREKSI: Pastikan nama kolom 'updated_at' (underscored)
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Konten_PPIDs");
  },
};
