"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perbaikan: Ganti nama tabel menjadi 'kategori_beritas' (huruf kecil, jamak)
    await queryInterface.createTable("kategori_beritas", {
      id_kategori: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_kategori: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      deskripsi_kategori: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("kategori_beritas");
  },
};
