// src/models/admin.js (Contoh)
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      level_akses: {
        type: DataTypes.ENUM("superadmin","admin", "user"), // Pastikan ENUM sudah update
        allowNull: false,
        defaultValue: "user",
      },
      // Kolom baru untuk fitur lupa sandi
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true, // Bisa null jika tidak ada reset token aktif
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true, // Bisa null jika tidak ada reset token aktif
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Admins",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Admin;
};
