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
      // UMKM dimiliki oleh Kategori_UMKM
      UMKM.belongsTo(models.Kategori_UMKM, {
        foreignKey: "id_kategori_umkm",
        as: "kategoriUMKM",
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
      hastag_umkm: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      alamat_umkm: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      kontak_umkm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jam_operasional: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hari_operasional: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website_umkm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gambar_produk_utama: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gambar_sampul: {
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
      id_kategori_umkm: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UMKM",
      tableName: "UMKMs",
      timestamps: true,
      underscored: true,
    }
  );
  return UMKM;
};
