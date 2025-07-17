// src/models/media_sosial.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media_Sosial extends Model {
    static associate(models) {
      // Media_Sosial dimiliki oleh Admin
      Media_Sosial.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
    }
  }
  Media_Sosial.init(
    {
      id_media_sosial: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_platform: {
        type: DataTypes.ENUM(
          "Facebook",
          "Instagram",
          "Twitter",
          "YouTube",
          "LinkedIn",
          "TikTok"
        ), // Sesuai migrasi
        allowNull: false,
      },
      url_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urutan_tampil: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Media_Sosial",
      tableName: "Media_Sosials", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Media_Sosial;
};
