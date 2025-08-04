// 20250730025713-create-kategori-ppid.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Kategori_PPIDs", {
      id_kategori_ppid: {
        // KOREKSI: Ubah 'id' menjadi 'id_kategori_ppid'
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_kategori: {
        type: Sequelize.STRING,
        allowNull: false, // KOREKSI: Tambahkan allowNull
        unique: true, // KOREKSI: Tambahkan unique
      },
      deskripsi_kategori: {
        type: Sequelize.TEXT,
        allowNull: true, // KOREKSI: Tambahkan allowNull
      },
      level_kategori: {
        type: Sequelize.INTEGER,
        allowNull: false, // KOREKSI: Tambahkan allowNull
        defaultValue: 1, // KOREKSI: Tambahkan defaultValue
      },
      id_kategori_induk: {
        type: Sequelize.INTEGER,
        allowNull: true, // KOREKSI: Tambahkan allowNull
        references: {
          // KOREKSI: Tambahkan referensi kunci asing
          model: "Kategori_PPIDs", // Self-referencing table name
          key: "id_kategori_ppid", // Self-referencing key
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Sesuai model Anda
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
    await queryInterface.dropTable("Kategori_PPIDs");
  },
};
