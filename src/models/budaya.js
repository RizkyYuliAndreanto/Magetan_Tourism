// models/budaya.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Budaya extends Model {
    static associate(models) {
      // Budaya dimiliki oleh Kategori_Budaya
      Budaya.belongsTo(models.Kategori_Budaya, {
        foreignKey: "id_kategori_budaya",
        as: "kategori",
      });
      // Budaya dikelola oleh Admin
      Budaya.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
      // Budaya memiliki banyak Media_Galeri (polimorfik)
      Budaya.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "budaya",
        },
        as: "galeriBudaya",
      });
    }
  }
  Budaya.init(
    {
      id_budaya: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul_budaya: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gambar_budaya: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deskripsi_budaya: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      id_kategori_budaya: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Budaya",
      tableName: "Budayas",
      timestamps: true,
    }
  );
  return Budaya;
};
