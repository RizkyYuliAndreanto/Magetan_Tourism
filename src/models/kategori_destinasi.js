// src/models/kategori_destinasi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori_Destinasi extends Model {
    static associate(models) {
      // Kategori_Destinasi memiliki banyak Destinasi
      Kategori_Destinasi.hasMany(models.Destinasi, {
        foreignKey: "id_kategori_destinasi",
        as: "destinasiTerkait",
      });
    }
  }
  Kategori_Destinasi.init(
    {
      id_kategori_destinasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deskripsi_kategori: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Kategori_Destinasi",
      tableName: "Kategori_Destinasi", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Kategori_Destinasi;
};
