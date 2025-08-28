// src/models/kategori_berita.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori_Berita extends Model {
    static associate(models) {
      Kategori_Berita.hasMany(models.Berita, {
        foreignKey: "id_kategori",
        as: "beritaTerkait",
      });
    }
  }
  Kategori_Berita.init(
    {
      id_kategori: {
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
      modelName: "Kategori_Berita",
      // Perbaikan: Nama tabel harus 'kategori_beritas'
      tableName: "kategori_beritas",
      timestamps: true,
      underscored: true,
    }
  );
  return Kategori_Berita;
};
