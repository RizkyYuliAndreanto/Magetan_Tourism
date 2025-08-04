// src/models/berita.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita extends Model {
    static associate(models) {
      // Asosiasi ke model Kategori_Berita
      Berita.belongsTo(models.Kategori_Berita, {
        foreignKey: "id_kategori",
        as: "kategoriBerita",
      });
      // Asosiasi ke model Admin
      Berita.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      // Asosiasi ke model Komentar
      Berita.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "komentarBerita",
      });
      // Asosiasi ke model Like
      Berita.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "likeBerita",
      });
      // Asosiasi ke model Media_Galeri
      Berita.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "galeriBerita",
      });
      // Asosiasi ke model Share_Log
      Berita.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "shareBerita",
      });
      // Asosiasi ke model Halaman
      Berita.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: { tipe_konten: "berita" },
        as: "halamanBerita",
      });
    }
  }
  Berita.init(
    {
      id_berita: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teras_berita: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isi_berita: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      penutup_berita: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tanggal_publikasi: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gambar_hero_berita: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      koordinat_lokasi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zoom_level_peta: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      jumlah_dilihat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      jumlah_share: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      id_kategori: {
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
      modelName: "Berita",
      tableName: "Beritas", // Menyesuaikan nama tabel agar konsisten dengan 'Kategori_Berita'
      timestamps: true,
      underscored: true,
    }
  );
  return Berita;
};
