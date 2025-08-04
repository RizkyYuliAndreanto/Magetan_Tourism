'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pengunjungs', {
      id_pengunjung: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_pengunjung: {
        type: Sequelize.STRING
      },
      email_pengunjung: {
        type: Sequelize.STRING
      },
      ip_address: {
        type: Sequelize.STRING
      },
      tanggal_registrasi: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pengunjungs');
  }
};