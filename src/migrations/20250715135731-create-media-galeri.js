'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Media_Galeris", {
      id_media_galeri: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipe_konten: {
        type: Sequelize.ENUM("berita", "destinasi", "sejarah", "event", "umkm"),
      },
      id_konten: {
        type: Sequelize.INTEGER,
      },
      path_file: {
        type: Sequelize.STRING,
      },
      deskripsi_file: {
        type: Sequelize.STRING,
      },
      jenis_file: {
        type: Sequelize.ENUM("gambar", "video"),
      },
      urutan_tampil: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Media_Galeris');
  }
};