// <timestamp>-create-pengumuman.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Pengumumans", {
      id_pengumuman: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul_pengumuman: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sampul_pengumuman: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isi_pengumuman: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      file_pdf_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tanggal_publikasi: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Pengumumans");
  },
};
