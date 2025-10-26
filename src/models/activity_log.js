"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      // Relasi ke model Admin
      ActivityLog.belongsTo(models.Admin, {
        foreignKey: "adminId",
        targetKey: "id_admin",
        as: "admin",
      });
    }
  }

  ActivityLog.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Admins",
          key: "id_admin",
        },
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Nama entitas yang diakses (berita, destinasi, event, dll)",
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID dari entitas yang diakses",
      },
      entityName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Nama/judul dari entitas yang diakses",
      },
      oldData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Data lama sebelum diubah (untuk update)",
      },
      newData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Data baru setelah diubah (untuk create/update)",
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Deskripsi aktivitas yang dilakukan",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "ActivityLog",
      tableName: "activity_logs",
      indexes: [
        {
          fields: ["adminId"],
        },
        {
          fields: ["action"],
        },
        {
          fields: ["entity"],
        },
        {
          fields: ["createdAt"],
        },
      ],
    }
  );

  return ActivityLog;
};
