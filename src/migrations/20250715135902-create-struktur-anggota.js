'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Struktur_Anggotas', {
      id_anggota: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_anggota: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      deskripsi_tugas: {
        type: Sequelize.TEXT
      },
      foto_anggota: {
        type: Sequelize.STRING
      },
      urutan_tampilan: {
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
    await queryInterface.dropTable('Struktur_Anggotas');
  }
};