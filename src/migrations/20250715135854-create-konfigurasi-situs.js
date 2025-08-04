'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Konfigurasi_Situs", {
      id_konfigurasi_situs: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_pengaturan: {
        type: Sequelize.STRING,
      },
      nilai_pengaturan: {
        type: Sequelize.TEXT,
      },
      tipe_pengaturan: {
        type: Sequelize.ENUM("teks", "angka", "gambar", "boolean", "json"),
      },
      terakhir_diubah: {
        type: Sequelize.DATE,
      },
      id_admin: {
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
    await queryInterface.dropTable('Konfigurasi_Situs');
  }
};