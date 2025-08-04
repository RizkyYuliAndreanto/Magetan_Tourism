// src/models/event.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Admin, {
        foreignKey: "id_admin",
        as: "adminPembuat",
      });
      Event.hasMany(models.Komentar, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "event",
        },
        as: "komentarEvent",
      });
      Event.hasMany(models.Like, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "event",
        },
        as: "likeEvent",
      });
      Event.hasMany(models.Media_Galeri, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "event",
        },
        as: "galeriEvent",
      });
      Event.hasMany(models.Share_Log, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "event",
        },
        as: "shareEvent",
      });
      Event.hasOne(models.Halaman, {
        foreignKey: "id_konten",
        constraints: false,
        scope: {
          tipe_konten: "event",
        },
        as: "halamanEvent",
      });
    }
  }
  Event.init(
    {
      id_event: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_event: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deskripsi_event: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tanggal_mulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lokasi_event: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      koordinat_lokasi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      brosur_event: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gambar_event: {
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
      modelName: "Event",
      tableName: "Events", // Sudah benar jamak
      timestamps: true,
      underscored: true,
    }
  );
  return Event;
};
