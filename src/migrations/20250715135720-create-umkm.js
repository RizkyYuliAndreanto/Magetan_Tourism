'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UMKMs', {
      id_umkm: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_umkm: {
        type: Sequelize.STRING
      },
      deskripsi_umkm: {
        type: Sequelize.TEXT
      },
      jenis_usaha: {
        type: Sequelize.STRING
      },
      alamat_umkm: {
        type: Sequelize.TEXT
      },
      kontak_umkm: {
        type: Sequelize.STRING
      },
      website_umkm: {
        type: Sequelize.STRING
      },
      gambar_produk_utama: {
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
    await queryInterface.dropTable('UMKMs');
  }
};