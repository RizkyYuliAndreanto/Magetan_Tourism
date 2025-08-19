// src/models/pengumuman.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengumuman extends Model {
    static associate(models) {
      // Pengumuman dikelola oleh Admin
      Pengumuman.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
    }
  }
  Pengumuman.init(
    {
      id_pengumuman: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul_pengumuman: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sampul_pengumuman: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isi_pengumuman: {
        type: DataTypes.TEXT,
        allowNull: true, // Opsional, jika pengumuman hanya file PDF
      },
      file_pdf_path: {
        // Path ke file PDF yang diunggah
        type: DataTypes.STRING,
        allowNull: false, // File PDF wajib ada
      },
      tanggal_publikasi: {
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
      modelName: "Pengumuman",
      tableName: "Pengumumans", // Nama tabel jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Pengumuman;
};
