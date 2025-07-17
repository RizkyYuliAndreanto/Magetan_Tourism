// src/models/berita.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita extends Model {
    static associate(models) {
      // Berita dimiliki oleh Kategori_Berita
      Berita.belongsTo(models.Kategori_Berita, {
        foreignKey: "id_kategori",
        as: "kategoriBerita",
      });
      // Berita dimiliki oleh Admin
      Berita.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      // Berita memiliki banyak Komentar (polimorfik melalui id_konten, tipe_konten)
      // Perhatikan: Untuk polimorfik, asosiasi ini perlu penanganan khusus di Komentar
      Berita.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false, // Penting untuk polimorfik
        scope: {
          tipe_konten: "berita",
        },
        as: "komentarBerita",
      });
      // Berita memiliki banyak Like (polimorfik)
      Berita.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false, // Penting untuk polimorfik
        scope: {
          tipe_konten: "berita",
        },
        as: "likeBerita",
      });
      // Berita memiliki banyak Media_Galeri (polimorfik)
      Berita.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "berita",
        },
        as: "galeriBerita",
      });
      // Berita memiliki banyak Share_Log (polimorfik)
      Berita.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "berita",
        },
        as: "shareBerita",
      });
      // Berita memiliki satu Halaman (polimorfik)
      Berita.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "berita",
        },
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
      tableName: "Berita", // Sesuai migrasi
      timestamps: true,
      underscored: true,
    }
  );
  return Berita;
};
