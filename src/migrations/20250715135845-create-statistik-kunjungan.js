'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Statistik_Kunjungans", {
      id_statistik_kunjungan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal_kunjungan: {
        type: Sequelize.DATE,
      },
      jumlah_pengunjung_unik: {
        type: Sequelize.INTEGER,
      },
      jumlah_page_views: {
        type: Sequelize.INTEGER,
      },
      id_halaman: {
        type: Sequelize.INTEGER,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Statistik_Kunjungans');
  }
};