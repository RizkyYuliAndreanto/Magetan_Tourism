"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activity_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Admins",
          key: "id_admin",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      action: {
        type: Sequelize.ENUM("create", "update", "delete", "login", "logout"),
        allowNull: false,
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Nama entitas yang diakses (berita, destinasi, event, dll)",
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "ID dari entitas yang diakses",
      },
      entityName: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Nama/judul dari entitas yang diakses",
      },
      oldData: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: "Data lama sebelum diubah (untuk update)",
      },
      newData: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: "Data baru setelah diubah (untuk create/update)",
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Deskripsi aktivitas yang dilakukan",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Tambahkan index untuk performa
    await queryInterface.addIndex("activity_logs", ["adminId"]);
    await queryInterface.addIndex("activity_logs", ["action"]);
    await queryInterface.addIndex("activity_logs", ["entity"]);
    await queryInterface.addIndex("activity_logs", ["createdAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("activity_logs");
  },
};
