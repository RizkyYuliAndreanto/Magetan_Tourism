'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Destinasis', {
      id_destinasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_destinasi: {
        type: Sequelize.STRING
      },
      deskripsi_destinasi: {
        type: Sequelize.TEXT
      },
      alamat: {
        type: Sequelize.TEXT
      },
      koordinat_lokasi: {
        type: Sequelize.STRING
      },
      jam_operasional: {
        type: Sequelize.STRING
      },
      harga_tiket: {
        type: Sequelize.DECIMAL
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER
      },
      jumlah_share: {
        type: Sequelize.INTEGER
      },
      gambar_utama: {
        type: Sequelize.STRING
      },
      id_kategori_destinasi: {
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
    await queryInterface.dropTable('Destinasis');
  }
};