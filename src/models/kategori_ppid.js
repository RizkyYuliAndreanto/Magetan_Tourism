// src/models/kategori_ppid.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori_PPID extends Model {
    static associate(models) {
      // Kategori_PPID dapat memiliki sub-kategori (self-referencing)
      Kategori_PPID.hasMany(models.Kategori_PPID, {
        as: "subKategoris",
        foreignKey: "id_kategori_induk", // Kunci asing untuk relasi diri
      });
      Kategori_PPID.belongsTo(models.Kategori_PPID, {
        as: "kategoriInduk",
        foreignKey: "id_kategori_induk",
      });

      // Kategori_PPID memiliki banyak Konten_PPID
      Kategori_PPID.hasMany(models.Konten_PPID, {
        foreignKey: "id_kategori_ppid",
        as: "kontenPPID",
      });
    }
  }
  Kategori_PPID.init(
    {
      id_kategori_ppid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Nama kategori harus unik
      },
      deskripsi_kategori: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      level_kategori: {
        // Untuk membedakan tingkat 1, 2, dst.
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      id_kategori_induk: {
        // Self-referencing foreign key
        type: DataTypes.INTEGER,
        allowNull: true, // Boleh null jika ini adalah kategori tingkat 1
        references: {
          model: "Kategori_PPIDs", // Nama tabel jamak
          key: "id_kategori_ppid",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Jika kategori induk dihapus, sub-kategori jadi kategori tingkat 1
      },
    },
    {
      sequelize,
      modelName: "Kategori_PPID",
      tableName: "Kategori_PPIDs", // Nama tabel jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Kategori_PPID;
};
