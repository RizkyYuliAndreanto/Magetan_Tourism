// migrations/20230101000000-create-kategori-budaya.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Kategori_Budayas", {
      id_kategori_budaya: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Kategori_Budayas");
  },
};
