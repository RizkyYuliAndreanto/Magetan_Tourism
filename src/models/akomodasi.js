// src/models/akomodasi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Akomodasi extends Model {
    static associate(models) {
      // Akomodasi dimiliki oleh Admin
      Akomodasi.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });
      // Akomodasi memiliki banyak Komentar (polimorfik)
      Akomodasi.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "akomodasi",
        },
        as: "komentarAkomodasi",
      });
      // Akomodasi memiliki banyak Like (polimorfik)
      Akomodasi.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "akomodasi",
        },
        as: "likeAkomodasi",
      });
      // Akomodasi memiliki banyak Media_Galeri (polimorfik)
      Akomodasi.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "akomodasi",
        },
        as: "galeriAkomodasi",
      });
      // Akomodasi memiliki banyak Share_Log (polimorfik)
      Akomodasi.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "akomodasi",
        },
        as: "shareAkomodasi",
      });
      // Akomodasi memiliki satu Halaman (polimorfik)
      Akomodasi.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "akomodasi",
        },
        as: "halamanAkomodasi",
      });
    }
  }
  Akomodasi.init(
    {
      id_akomodasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_hotel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_hotel: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      alamat_hotel: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      koordinat_lokasi: {
        type: DataTypes.STRING, // Format "lintang,bujur"
        allowNull: true,
      },
      fasilitas: {
        type: DataTypes.TEXT, // Bisa JSON string dari array atau teks biasa
        allowNull: true,
      },
      gambar_utama_hotel: { // Gambar hero/utama hotel
        type: DataTypes.STRING,
        allowNull: true,
      },
      kontak_hotel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website_hotel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating_hotel: { // Opsional: 1-5 bintang
        type: DataTypes.DECIMAL(2, 1),
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
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Akomodasi",
      tableName: "Akomodasis", // Nama tabel jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Akomodasi;
};