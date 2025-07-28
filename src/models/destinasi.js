// src/models/destinasi.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destinasi extends Model {
    static associate(models) {
      Destinasi.belongsTo(models.Kategori_Destinasi, {
        foreignKey: "id_kategori_destinasi",
        as: "kategoriDestinasi",
      });
      Destinasi.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      Destinasi.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "destinasi",
        },
        as: "komentarDestinasi",
      });
      Destinasi.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "destinasi",
        },
        as: "likeDestinasi",
      });
      Destinasi.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "destinasi",
        },
        as: "galeriDestinasi",
      });
      Destinasi.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "destinasi",
        },
        as: "shareDestinasi",
      });
      Destinasi.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "destinasi",
        },
        as: "halamanDestinasi",
      });
    }
  }
  Destinasi.init(
    {
      id_destinasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_destinasi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_destinasi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      koordinat_lokasi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jam_operasional: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      harga_tiket: {
        type: DataTypes.DECIMAL(10, 2),
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
      gambar_utama: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_kategori_destinasi: {
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
      modelName: "Destinasi",
      tableName: "Destinasis", // KOREKSI: Sesuaikan dengan nama tabel jamak 'Destinasis'
      timestamps: true,
      underscored: true,
    }
  );
  return Destinasi;
};
