// src/models/komentar.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Komentar extends Model {
    static associate(models) {
      // Note: id_pengunjung field exists but no Pengunjung model/table
      // Komentar uses nama_komentator and email_komentator fields directly
      // Komentar adalah polimorfik, dimiliki oleh berbagai model konten
      Komentar.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "berita",
      });
      Komentar.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "event" },
        as: "event",
      });
      Komentar.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "destinasi" },
        as: "destinasi",
      });
      Komentar.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "umkm" },
        as: "umkm",
      });
      Komentar.belongsTo(models.Budaya, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "budaya" },
        as: "budaya",
      });
    }
  }
  Komentar.init(
    {
      id_komentar: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_pengunjung: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipe_konten: {
        type: DataTypes.ENUM("berita", "event", "sejarah", "destinasi", "umkm"), // Sesuai migrasi, tambahkan 'sejarah'
        allowNull: false,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama_komentator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_komentator: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isi_komentar: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tanggal_komentar: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status_komentar: {
        type: DataTypes.ENUM("pending", "disetujui", "ditolak"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Komentar",
      tableName: "Komentars", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Komentar;
};
