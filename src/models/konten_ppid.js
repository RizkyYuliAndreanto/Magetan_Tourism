// src/models/konten_ppid.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Konten_PPID extends Model {
    static associate(models) {
      // Konten_PPID dimiliki oleh Kategori_PPID
      Konten_PPID.belongsTo(models.Kategori_PPID, {
        foreignKey: "id_kategori_ppid",
        as: "kategoriPPID",
      });
      // Konten_PPID dikelola oleh Admin
      Konten_PPID.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });

      // Konten_PPID dapat memiliki banyak Media_Galeri (gambar tambahan, bukan PDF utama)
      Konten_PPID.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "ppid_konten", // Tipe konten spesifik untuk PPID di Media_Galeri
        },
        as: "galeriKontenPPID",
      });
    }
  }
  Konten_PPID.init(
    {
      id_konten_ppid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul_konten: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_konten: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      file_pdf_path: {
        // Path ke file PDF utama (misal: laporan)
        type: DataTypes.STRING,
        allowNull: true, // Boleh null jika hanya berupa gambar di galeri
      },
      tanggal_publikasi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      id_kategori_ppid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Kategori_PPIDs", // Nama tabel kategori PPID
          key: "id_kategori_ppid",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Admins",
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
    },
    {
      sequelize,
      modelName: "Konten_PPID",
      tableName: "Konten_PPIDs", // Nama tabel jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Konten_PPID;
};
