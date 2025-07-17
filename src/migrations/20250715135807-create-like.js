'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Likes", {
      id_like: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_pengunjung: {
        type: Sequelize.INTEGER,
      },
      tipe_konten: {
        type: Sequelize.ENUM("berita", "destinasi", "sejarah", "event", "umkm"),
      },
      id_konten: {
        type: Sequelize.INTEGER,
      },
      tanggal_like: {
        type: Sequelize.DATE,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};