// <timestamp>-create-visi-misi.js
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Visi_Misis", {
      id_visi_misi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visi_misi_file_path: {
        // Path ke file gambar atau PDF Visi Misi
        type: Sequelize.STRING,
        allowNull: true, // Izinkan null jika Visi Misi bisa berupa teks saja tanpa file
      },
      tipe_file_visi_misi: {
        // Untuk menandakan jenis file: 'gambar' atau 'pdf'
        type: Sequelize.ENUM("gambar", "pdf"),
        allowNull: true, // Izinkan null jika tidak ada file yang diunggah
      },
      deskripsi: {
        // Kolom untuk teks deskripsi tambahan atau sebagai alternatif jika tidak ada file
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tanggal_pembaruan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Admins", // Pastikan nama tabel Admins sudah benar (jamak)
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Atau 'SET NULL' jika ingin id_admin bisa null saat admin dihapus
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Visi_Misis");
  },
};
