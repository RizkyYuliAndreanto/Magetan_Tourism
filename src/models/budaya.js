// models/budaya.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Budaya extends Model {
    static associate(models) {
      // Budaya dikelola oleh Admin
      Budaya.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPengelola",
      });

      // Budaya memiliki banyak Media_Galeri (polimorfik)
      Budaya.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "budaya",
        },
        as: "galeriBudaya",
      });

      // Budaya memiliki banyak Komentar (polimorfik)
      Budaya.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "budaya",
        },
        as: "komentarBudaya",
      });

      // Budaya memiliki banyak Like (polimorfik)
      Budaya.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "budaya",
        },
        as: "likeBudaya",
      });

      // Budaya memiliki banyak Share_Log (polimorfik)
      Budaya.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "budaya",
        },
        as: "shareBudaya",
      });
    }
  }
  Budaya.init(
    {
      id_budaya: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      judul_budaya: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      gambar_budaya: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deskripsi_budaya: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      kategori_budaya: {
        type: DataTypes.ENUM(
          "Objek Pengembangan Budaya",
          "Situs Kebudayaan",
          "Sejarah"
        ),
        allowNull: true,
      },

      id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Budaya",
      tableName: "Budayas",
      timestamps: true,
    }
  );
  return Budaya;
};
