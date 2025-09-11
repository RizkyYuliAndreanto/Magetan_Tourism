// src/models/like.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // Like dimiliki oleh Pengunjung
      Like.belongsTo(models.Pengunjung, {
        foreignKey: "id_pengunjung",
        as: "pengunjung",
      });
      // Like adalah polimorfik, terkait dengan berbagai model konten
      Like.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "berita",
      });
      Like.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "destinasi" },
        as: "destinasi",
      });
      Like.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "event" },
        as: "event",
      });
      Like.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "umkm" },
        as: "umkm",
      });
      Like.belongsTo(models.Sejarah, {
        // Tambahkan asosiasi untuk Sejarah
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "sejarah" },
        as: "sejarah",
      });
    }
  }
  Like.init(
    {
      id_like: {
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
        type: DataTypes.ENUM("berita", "destinasi", "sejarah", "event", "umkm"), // Sesuai migrasi, tambahkan 'sejarah'
        allowNull: true,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tanggal_like: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "Likes", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Like;
};
