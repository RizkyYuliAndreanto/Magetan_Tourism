// src/models/halaman.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Halaman extends Model {
    static associate(models) {
      // Halaman adalah polimorfik, terkait dengan berbagai model konten
      Halaman.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "berita",
      });
      Halaman.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "event" },
        as: "event",
      });
      Halaman.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "umkm" },
        as: "umkm",
      });
      Halaman.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "destinasi" },
        as: "destinasi",
      });
      Halaman.belongsTo(models.Sejarah, {
        // Tambahkan asosiasi untuk Sejarah
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "sejarah" },
        as: "sejarah",
      });
      // Halaman memiliki banyak Statistik_Kunjungan
      Halaman.hasMany(models.Statistik_Kunjungan, {
        foreignKey: "id_halaman",
        as: "statistikKunjungan",
      });
    }
  }
  Halaman.init(
    {
      id_halaman: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipe_konten: {
        type: DataTypes.ENUM(
          "berita",
          "event",
          "sejarah",
          "umkm",
          "destinasi",
          "lainnya"
        ), // Sesuai migrasi, tambahkan 'sejarah'
        allowNull: false,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      slug_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Halaman",
      tableName: "Halamans", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Halaman;
};
