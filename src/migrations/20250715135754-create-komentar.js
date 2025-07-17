'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Komentars", {
      id_komentar: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_pengunjung: {
        type: Sequelize.INTEGER,
      },
      tipe_konten: {
        type: Sequelize.ENUM("berita", "event","sejarah","destinasi", "umkm"),
      },
      id_konten: {
        type: Sequelize.INTEGER,
      },
      nama_komentator: {
        type: Sequelize.STRING,
      },
      email_komentator: {
        type: Sequelize.STRING,
      },
      isi_komentar: {
        type: Sequelize.TEXT,
      },
      tanggal_komentar: {
        type: Sequelize.DATE,
      },
      status_komentar: {
        type: Sequelize.ENUM("pending", "disetujui", "ditolak"),
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
    await queryInterface.dropTable('Komentars');
  }
};