// src/models/share_log.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Share_Log extends Model {
    static associate(models) {
      // Share_Log dimiliki oleh Pengunjung
      Share_Log.belongsTo(models.Pengunjung, {
        foreignKey: "id_pengunjung",
        as: "pengunjung",
      });
      // Share_Log adalah polimorfik, terkait dengan berbagai model konten
      Share_Log.belongsTo(models.Berita, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "berita",
      });
      Share_Log.belongsTo(models.Event, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "event" },
        as: "event",
      });
      Share_Log.belongsTo(models.UMKM, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "umkm" },
        as: "umkm",
      });
      Share_Log.belongsTo(models.Destinasi, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "destinasi" },
        as: "destinasi",
      });
      Share_Log.belongsTo(models.Sejarah, {
        // Tambahkan asosiasi untuk Sejarah
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "sejarah" },
        as: "sejarah",
      });
    }
  }
  Share_Log.init(
    {
      id_share_log: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_pengunjung: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tipe_konten: {
        type: DataTypes.ENUM("berita", "destinasi", "sejarah", "event", "umkm"), // Sesuai migrasi, tambahkan 'sejarah'
        allowNull: false,
      },
      id_konten: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      platform_share: {
        type: DataTypes.ENUM(
          "Facebook",
          "Wa",
          "Twitter",
          "Copy_link",
          "Email",
          "Telegram",
          "TikTok",
          "LinkedIn",
          "Instagram"
        ), // Sesuai migrasi
        allowNull: false,
      },
      tanggal_share: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Share_Log",
      tableName: "Share_Logs", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Share_Log;
};
