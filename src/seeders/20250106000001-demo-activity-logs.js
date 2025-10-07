"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ambil admin yang ada untuk membuat data dummy
    const admins = await queryInterface.sequelize.query(
      "SELECT id_admin FROM `Admins` LIMIT 3",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (admins.length === 0) {
      console.log("No admin found, skipping activity log seeding");
      return;
    }

    const activities = [];
    const entities = ["berita", "destinasi", "event", "umkm", "media"];
    const actions = ["create", "update", "delete"];

    // Generate data dummy untuk setiap admin
    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i];

      // Generate 10 aktivitas untuk setiap admin
      for (let j = 0; j < 10; j++) {
        const entity = entities[Math.floor(Math.random() * entities.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const entityId = Math.floor(Math.random() * 100) + 1;

        let description = "";
        let entityName = "";

        switch (action) {
          case "create":
            entityName = `${
              entity.charAt(0).toUpperCase() + entity.slice(1)
            } ${entityId}`;
            description = `Menambahkan ${entity} baru: "${entityName}"`;
            break;
          case "update":
            entityName = `${
              entity.charAt(0).toUpperCase() + entity.slice(1)
            } ${entityId}`;
            description = `Memperbarui ${entity}: "${entityName}"`;
            break;
          case "delete":
            entityName = `${
              entity.charAt(0).toUpperCase() + entity.slice(1)
            } ${entityId}`;
            description = `Menghapus ${entity}: "${entityName}"`;
            break;
        }

        // Generate tanggal random dalam 30 hari terakhir
        const randomDate = new Date();
        randomDate.setDate(
          randomDate.getDate() - Math.floor(Math.random() * 30)
        );

        activities.push({
          adminId: admin.id_admin,
          action: action,
          entity: entity,
          entityId: entityId,
          entityName: entityName,
          oldData: action === "update" ? JSON.stringify({ old: "data" }) : null,
          newData: action !== "delete" ? JSON.stringify({ new: "data" }) : null,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          description: description,
          createdAt: randomDate,
          updatedAt: randomDate,
        });
      }
    }

    // Insert data ke database
    await queryInterface.bulkInsert("activity_logs", activities);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("activity_logs", null, {});
  },
};
