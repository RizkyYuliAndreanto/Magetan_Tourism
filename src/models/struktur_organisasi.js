// src/models/struktur_organisasi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Struktur_Organisasi extends Model {
    static associate(models) {
      // Struktur_Organisasi dikelola oleh Admin
      Struktur_Organisasi.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
    }
  }
  Struktur_Organisasi.init(
    {
      id_struktur_organisasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul_struktur: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Struktur Organisasi",
      },
      deskripsi_struktur: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gambar_struktur_path: {
        // Path ke file gambar struktur organisasi
        type: DataTypes.STRING,
        allowNull: false, // Gambar wajib ada
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
      modelName: "Struktur_Organisasi",
      tableName: "Struktur_Organisasis", // Nama tabel jamak
      timestamps: true, // Akan secara otomatis menambahkan createdAt dan updatedAt
      underscored: true,
    }
  );
  return Struktur_Organisasi;
};
