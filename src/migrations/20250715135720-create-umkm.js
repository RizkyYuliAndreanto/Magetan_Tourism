// migrations/20250715135720-create-umkm.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UMKMs", {
      id_umkm: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_umkm: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deskripsi_umkm: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      jenis_usaha: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      alamat_umkm: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      kontak_umkm: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website_umkm: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gambar_produk_utama: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gambar_sampul: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jumlah_share: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Admins",
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      id_kategori_umkm: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Kategori_UMKMs",
          key: "id_kategori_umkm",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("UMKMs");
  },
};
