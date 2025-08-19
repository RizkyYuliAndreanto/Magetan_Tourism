// migrations/20230101000002-create-kategori-umkm.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Kategori_UMKMs", {
      id_kategori_umkm: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_kategori: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deskripsi_kategori: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gambar_sampul: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Kategori_UMKMs");
  },
};
