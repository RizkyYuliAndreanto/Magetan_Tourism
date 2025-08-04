// src/models/sejarah.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sejarah extends Model {
    static associate(models) {
      Sejarah.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      Sejarah.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "sejarah",
        },
        as: "komentarSejarah",
      });
      Sejarah.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "sejarah",
        },
        as: "likeSejarah",
      });
      Sejarah.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "sejarah",
        },
        as: "galeriSejarah",
      });
      Sejarah.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "sejarah",
        },
        as: "shareSejarah",
      });
      Sejarah.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "sejarah",
        },
        as: "halamanSejarah",
      });
    }
  }
  Sejarah.init(
    {
      id_sejarah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tanggal_kejadian: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gambar_sejarah: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Sejarah",
      tableName: "Sejarahs", // KOREKSI: Sesuaikan dengan nama tabel jamak 'Sejarahs'
      timestamps: true,
      underscored: true,
    }
  );
  return Sejarah;
};
