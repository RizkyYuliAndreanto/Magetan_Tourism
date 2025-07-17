// src/models/struktur_anggota.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Struktur_Anggota extends Model {
    static associate(models) {
      // Struktur_Anggota dimiliki oleh Admin
      Struktur_Anggota.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
    }
  }
  Struktur_Anggota.init(
    {
      id_anggota: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_anggota: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jabatan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_tugas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      foto_anggota: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urutan_tampilan: {
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
      modelName: "Struktur_Anggota",
      tableName: "Struktur_Anggotas", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Struktur_Anggota;
};
