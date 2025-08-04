// src/models/visi_misi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Visi_Misi extends Model {
    static associate(models) {
      // Visi_Misi dikelola oleh Admin
      Visi_Misi.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
    }
  }
  Visi_Misi.init(
    {
      id_visi_misi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      visi_misi_file_path: {
        // KOLOM BARU: Untuk menyimpan path gambar/PDF Visi Misi
        type: DataTypes.STRING,
        allowNull: true, // Bisa null jika ada teks saja, tapi lebih baik wajibkan jika ini pengganti teks
      },
      tipe_file_visi_misi: {
        // KOLOM BARU: Untuk menandakan jenis file (gambar/pdf)
        type: DataTypes.ENUM("gambar", "pdf"),
        allowNull: true, // Bisa null jika tidak ada file
      },
      deskripsi: {
        // Kolom deskripsi umum (seperti tambahan untuk Visi Misi, atau untuk teks jika tidak ada file)
        type: DataTypes.TEXT,
        allowNull: true, // Mengizinkan null jika Visi Misi hanya berupa file
      },
      tanggal_pembaruan: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Visi_Misi",
      tableName: "Visi_Misis", // Nama tabel jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Visi_Misi;
};
