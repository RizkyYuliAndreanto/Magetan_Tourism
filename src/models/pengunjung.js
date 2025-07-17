// src/models/pengunjung.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengunjung extends Model {
    static associate(models) {
      // Pengunjung memiliki banyak Komentar
      Pengunjung.hasMany(models.Komentar, {
        foreignKey: "id_pengunjung",
        as: "komentarDibuat",
      });
      // Pengunjung memiliki banyak Like
      Pengunjung.hasMany(models.Like, {
        foreignKey: "id_pengunjung",
        as: "likeDibuat",
      });
      // Pengunjung memiliki banyak Share_Log
      Pengunjung.hasMany(models.Share_Log, {
        foreignKey: "id_pengunjung",
        as: "shareLog",
      });
    }
  }
  Pengunjung.init(
    {
      id_pengunjung: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_pengunjung: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Anonim",
      },
      email_pengunjung: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_registrasi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Pengunjung",
      tableName: "Pengunjungs", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Pengunjung;
};
