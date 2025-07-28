'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Beritas', {
      id_berita: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      judul: {
        type: Sequelize.STRING
      },
      teras_berita: {
        type: Sequelize.TEXT
      },
      isi_berita: {
        type: Sequelize.TEXT
      },
      penutup_berita: {
        type: Sequelize.TEXT
      },
      tanggal_publikasi: {
        type: Sequelize.DATE
      },
      gambar_hero_berita: {
        type: Sequelize.STRING
      },
      koordinat_lokasi: {
        type: Sequelize.STRING
      },
      zoom_level_peta: {
        type: Sequelize.INTEGER
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER
      },
      jumlah_share: {
        type: Sequelize.INTEGER
      },
      id_kategori: {
        type: Sequelize.INTEGER
      },
      id_admin: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Berita');
  }
};