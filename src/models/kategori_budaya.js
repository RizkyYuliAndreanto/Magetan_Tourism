// models/kategori_budaya.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori_Budaya extends Model {
    static associate(models) {
      // Kategori_Budaya memiliki banyak Budaya
      Kategori_Budaya.hasMany(models.Budaya, {
        foreignKey: "id_kategori_budaya",
        as: "budayas",
      });
    }
  }
  Kategori_Budaya.init(
    {
      id_kategori_budaya: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_kategori: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      gambar_sampul: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Kategori_Budaya",
      tableName: "Kategori_Budayas",
      timestamps: true,
    }
  );
  return Kategori_Budaya;
};
