const { ActivityLog } = require("../models");

/**
 * Middleware untuk logging aktivitas admin
 * @param {string} action - Jenis aksi (create, update, delete)
 * @param {string} entity - Nama entitas (berita, destinasi, event, dll)
 * @param {object} options - Opsi tambahan untuk logging
 */
const activityLogger = (action, entity, options = {}) => {
  return async (req, res, next) => {
    // Simpan original response methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.send
    res.send = function (data) {
      logActivity(req, res, data, action, entity, options);
      originalSend.call(this, data);
    };

    // Override res.json
    res.json = function (data) {
      logActivity(req, res, data, action, entity, options);
      originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Function untuk mencatat aktivitas
 */
const logActivity = async (req, res, responseData, action, entity, options) => {
  try {
    // Hanya log jika response sukses (status 200-299)
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return;
    }

    // Pastikan admin login
    if (!req.admin || !req.admin.id_admin) {
      return;
    }

    // Extract informasi dari request dan response
    const adminId = req.admin.id_admin;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    let entityId = null;
    let entityName = null;
    let newData = null;
    let oldData = req.originalData || null; // Data lama dari middleware sebelumnya
    let description = null;

    // Extract data berdasarkan jenis response
    if (responseData && typeof responseData === "object") {
      const parsedData =
        typeof responseData === "string"
          ? JSON.parse(responseData)
          : responseData;

      // Cari data dari response
      if (parsedData.data) {
        const data = parsedData.data;
        entityId = data.id;
        entityName = data.judul || data.nama || data.title || data.name;
        newData = data;
      } else if (parsedData.id) {
        entityId = parsedData.id;
        entityName =
          parsedData.judul ||
          parsedData.nama ||
          parsedData.title ||
          parsedData.name;
        newData = parsedData;
      }
    }

    // Extract ID dari URL parameters jika tidak ada di response
    if (!entityId && req.params.id) {
      entityId = req.params.id;
    }

    // Generate description berdasarkan action
    switch (action) {
      case "create":
        description = `Menambahkan ${entity} baru${
          entityName ? `: "${entityName}"` : ""
        }`;
        break;
      case "update":
        description = `Memperbarui ${entity}${
          entityName ? `: "${entityName}"` : ""
        }`;
        break;
      case "delete":
        description = `Menghapus ${entity}${
          entityName ? `: "${entityName}"` : ""
        }`;
        break;
      case "login":
        description = `Login ke sistem`;
        break;
      case "logout":
        description = `Logout dari sistem`;
        break;
      default:
        description = `Melakukan ${action} pada ${entity}`;
    }

    // Custom description dari options
    if (options.description) {
      description = options.description;
    }

    // Simpan activity log
    await ActivityLog.create({
      adminId,
      action,
      entity,
      entityId,
      entityName,
      oldData,
      newData,
      ipAddress,
      userAgent,
      description,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Tidak throw error agar tidak mengganggu response utama
  }
};

/**
 * Middleware untuk menyimpan data lama sebelum update
 */
const saveOriginalData = (model, idField = "id") => {
  return async (req, res, next) => {
    try {
      const id = req.params[idField] || req.params.id;
      if (id && model) {
        const originalData = await model.findByPk(id);
        req.originalData = originalData ? originalData.toJSON() : null;
      }
    } catch (error) {
      console.error("Error saving original data:", error);
    }
    next();
  };
};

/**
 * Manual logging function untuk kasus khusus
 */
const logManualActivity = async (adminId, action, entity, data = {}) => {
  try {
    await ActivityLog.create({
      adminId,
      action,
      entity,
      entityId: data.entityId || null,
      entityName: data.entityName || null,
      oldData: data.oldData || null,
      newData: data.newData || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      description: data.description || null,
    });
  } catch (error) {
    console.error("Error in manual activity logging:", error);
  }
};

module.exports = {
  activityLogger,
  saveOriginalData,
  logManualActivity,
};
