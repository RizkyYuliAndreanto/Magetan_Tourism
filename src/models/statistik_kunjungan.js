// src/models/statistik_kunjungan.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Statistik_Kunjungan extends Model {
    static associate(models) {
      // Statistik_Kunjungan dimiliki oleh Halaman
      Statistik_Kunjungan.belongsTo(models.Halaman, {
        foreignKey: "id_halaman",
        as: "halaman",
      });
    }
  }
  Statistik_Kunjungan.init(
    {
      id_statistik_kunjungan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tanggal_kunjungan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      jumlah_pengunjung_unik: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      jumlah_page_views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      id_halaman: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Statistik_Kunjungan",
      tableName: "Statistik_Kunjungans", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Statistik_Kunjungan;
};
