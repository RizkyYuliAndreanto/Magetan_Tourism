// src/models/umkm.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UMKM extends Model {
    static associate(models) {
      // UMKM dimiliki oleh Admin
      UMKM.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      // UMKM memiliki banyak Komentar (polimorfik)
      UMKM.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "umkm",
        },
        as: "komentarUMKM",
      });
      // UMKM memiliki banyak Like (polimorfik)
      UMKM.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "umkm",
        },
        as: "likeUMKM",
      });
      // UMKM memiliki banyak Media_Galeri (polimorfik)
      UMKM.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "umkm",
        },
        as: "galeriUMKM",
      });
      // UMKM memiliki banyak Share_Log (polimorfik)
      UMKM.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "umkm",
        },
        as: "shareUMKM",
      });
      // UMKM memiliki satu Halaman (polimorfik)
      UMKM.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "umkm",
        },
        as: "halamanUMKM",
      });
    }
  }
  UMKM.init(
    {
      id_umkm: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_umkm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_umkm: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      jenis_usaha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_umkm: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      kontak_umkm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website_umkm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gambar_produk_utama: {
        type: DataTypes.STRING,
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
      modelName: "UMKM",
      tableName: "UMKMs", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return UMKM;
};
