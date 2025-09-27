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
      kategori_budaya: {
        type: Sequelize.ENUM('Objek Pengembangan Budaya', 'Situs Kebudayaan', 'Sejarah'),
        allowNull: true,
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
