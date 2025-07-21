// 20250715135552-create-admin.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Admins", {
      id_admin: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama_lengkap: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      
      level_akses: {
        type: Sequelize.ENUM("superadmin", "admin", "user"),
        allowNull: false,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: Sequelize.STRING,
       allowNull: true,
      },
      // *** PERUBAHAN DI SINI ***
      created_at: {
        // Ubah dari 'createdAt'
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        // Ubah dari 'updatedAt'
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Admins");
  },
};
