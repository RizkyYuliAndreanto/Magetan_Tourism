// Check non-login activities
const { ActivityLog, Admin } = require("./src/models");
const { Op } = require("sequelize");

ActivityLog.findAll({
  where: {
    action: { [Op.ne]: "login" },
  },
  limit: 10,
  order: [["createdAt", "DESC"]],
  include: [
    {
      model: Admin,
      as: "admin",
      attributes: ["nama_lengkap"],
    },
  ],
}).then((activities) => {
  console.log("📋 Recent non-login activities:");
  if (activities.length === 0) {
    console.log("❌ No CRUD activities found!");
    console.log(
      "💡 Try performing some CRUD operations (create/update/delete) to test activity logging."
    );
  } else {
    activities.forEach((a, i) => {
      console.log(`${i + 1}. [${a.action.toUpperCase()}] ${a.entity}`);
      console.log(`   📝 ${a.description}`);
      console.log(`   👤 ${a.admin?.nama_lengkap || "Unknown Admin"}`);
      console.log(`   🕒 ${a.createdAt.toLocaleString()}`);
      console.log("");
    });
  }
  process.exit(0);
});
