// models/kategori_umkm.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori_UMKM extends Model {
    static associate(models) {
      // Kategori_UMKM memiliki banyak UMKM
      Kategori_UMKM.hasMany(models.UMKM, {
        foreignKey: "id_kategori_umkm",
        as: "umkms",
      });
    }
  }
  Kategori_UMKM.init(
    {
      id_kategori_umkm: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gambar_sampul: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Kategori_UMKM",
      tableName: "Kategori_UMKMs",
      timestamps: true,
      underscored: true,
    }
  );
  return Kategori_UMKM;
};
