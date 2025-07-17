'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id_event: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_event: {
        type: Sequelize.STRING
      },
      deskripsi_event: {
        type: Sequelize.TEXT
      },
      tanggal_mulai: {
        type: Sequelize.DATE
      },
      tanggal_selesai: {
        type: Sequelize.DATE
      },
      lokasi_event: {
        type: Sequelize.TEXT
      },
      koordinat_lokasi: {
        type: Sequelize.STRING
      },
      brosur_event: {
        type: Sequelize.STRING
      },
      gambar_event: {
        type: Sequelize.STRING
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER
      },
      jumlah_share: {
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
    await queryInterface.dropTable('Events');
  }
};