// src/models/media_galeri.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media_Galeri extends Model {
    static associate(models) {
      // Asosiasi polimorfik kembali ke konten (Berita, Destinasi, Event, UMKM, Sejarah)
      // Hapus opsi 'scope' dari semua belongsTo di sini
      Media_Galeri.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        // scope: { tipe_konten: "berita" }, // HAPUS BARIS INI
        as: "berita",
      });
      Media_Galeri.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        // scope: { tipe_konten: "destinasi" }, // HAPUS BARIS INI
        as: "destinasi",
      });
      Media_Galeri.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        // scope: { tipe_konten: "event" }, // HAPUS BARIS INI
        as: "event",
      });
      Media_Galeri.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        // scope: { tipe_konten: "umkm" }, // HAPUS BARIS INI
        as: "umkm",
      });
      Media_Galeri.belongsTo(models.Sejarah, {
        foreignKey: "id_konten",
        constraints: false,
        // scope: { tipe_konten: "sejarah" }, // HAPUS BARIS INI
        as: "sejarah",
      });
    }
  }
  Media_Galeri.init(
    {
      id_media_galeri: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipe_konten: {
        type: DataTypes.ENUM("berita", "destinasi", "sejarah", "event", "umkm"),
        allowNull: false,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      path_file: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jenis_file: {
        type: DataTypes.ENUM("gambar", "video"),
        allowNull: false,
      },
      urutan_tampil: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Media_Galeri",
      tableName: "Media_Galeris",
      timestamps: true,
      underscored: true,
    }
  );
  return Media_Galeri;
};
