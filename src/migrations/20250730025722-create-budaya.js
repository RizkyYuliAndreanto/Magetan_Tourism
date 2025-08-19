// migrations/20230101000001-create-budaya.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Budayas", {
      id_budaya: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul_budaya: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gambar_budaya: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deskripsi_budaya: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      id_kategori_budaya: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Kategori_Budayas",
          key: "id_kategori_budaya",
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
    await queryInterface.dropTable("Budayas");
  },
};
