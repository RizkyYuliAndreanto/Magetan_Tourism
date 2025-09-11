// src/models/media_galeri.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media_Galeri extends Model {
    static associate(models) {
      // Asosiasi polimorfik kembali ke konten
      Media_Galeri.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        as: "berita",
      });
      Media_Galeri.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        as: "destinasi",
      });
      Media_Galeri.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        as: "event",
      });
      Media_Galeri.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        as: "umkm",
      });
      Media_Galeri.belongsTo(models.Sejarah, {
        foreignKey: "id_konten",
        constraints: false,
        as: "sejarah",
      });
      Media_Galeri.belongsTo(models.Budaya, {
        foreignKey: "id_konten",
        constraints: false,
        as: "budaya",
      });
      Media_Galeri.belongsTo(models.Akomodasi, {
        foreignKey: "id_konten",
        constraints: false,
        as: "akomodasi",
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
        type: DataTypes.ENUM(
          "berita",
          "destinasi",
          "sejarah",
          "event",
          "umkm",
          "budaya",
          "akomodasi"
        ),
        // UBAH INI: Izinkan nilai NULL untuk mengizinkan media tanpa relasi
        allowNull: true,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        // UBAH INI: Izinkan nilai NULL
        allowNull: true,
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
