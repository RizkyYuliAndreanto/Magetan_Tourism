// src/models/konfigurasi_situs.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Konfigurasi_Situs extends Model {
    static associate(models) {
      // Konfigurasi_Situs dimiliki oleh Admin
      Konfigurasi_Situs.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminTerakhirMengubah",
      });
    }
  }
  Konfigurasi_Situs.init(
    {
      id_konfigurasi_situs: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_pengaturan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nilai_pengaturan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tipe_pengaturan: {
        type: DataTypes.ENUM("teks", "angka", "gambar", "boolean", "json"), // Sesuai migrasi
        allowNull: false,
      },
      terakhir_diubah: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Konfigurasi_Situs",
      tableName: "Konfigurasi_Situs", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Konfigurasi_Situs;
};
