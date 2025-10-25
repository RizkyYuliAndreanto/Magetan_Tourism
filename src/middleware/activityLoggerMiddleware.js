const { ActivityLog } = require("../models");

/**
 * Helper function untuk mengubah entity name menjadi display name yang user-friendly
 */
const getEntityDisplayName = (entity) => {
  const entityMap = {
    berita: "berita",
    destinasi: "destinasi wisata",
    event: "event",
    umkm: "UMKM",
    media: "media galeri",
    budaya: "budaya/sejarah",
    akomodasi: "akomodasi",
    pengumuman: "pengumuman",
    ppid: "konten PPID",
    "visi-misi": "visi misi",
    "struktur-organisasi": "struktur organisasi",
    "struktur-anggota": "struktur anggota",
    "kategori-berita": "kategori berita",
    "kategori-destinasi": "kategori destinasi",
    "kategori-umkm": "kategori UMKM",
    "kategori-ppid": "kategori PPID",
    system: "sistem",
  };

  return entityMap[entity] || entity;
};

/**
 * Middleware untuk logging aktivitas admin
 * @param {string} action - Jenis aksi (create, update, delete)
 * @param {string} entity - Nama entitas (berita, destinasi, event, dll)
 * @param {object} options - Opsi tambahan untuk logging
 */
const activityLogger = (action, entity, options = {}) => {
  return async (req, res, next) => {
    // Flag untuk mencegah duplikasi logging
    let activityLogged = false;

    // Simpan original response methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Function untuk log activity hanya sekali
    const logOnce = (data) => {
      if (!activityLogged) {
        activityLogged = true;
        logActivity(req, res, data, action, entity, options);
      }
    };

    // Override res.send
    res.send = function (data) {
      logOnce(data);
      originalSend.call(this, data);
    };

    // Override res.json
    res.json = function (data) {
      logOnce(data);
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

    // Proteksi terhadap duplikasi berdasarkan request yang sama
    const requestKey = `${req.method}:${req.originalUrl}:${req.admin.id_admin}`;
    const now = Date.now();

    // Simple in-memory cache untuk mencegah duplikasi dalam 1 detik
    if (!global.activityLogCache) {
      global.activityLogCache = new Map();
    }

    const lastLogTime = global.activityLogCache.get(requestKey);
    if (lastLogTime && now - lastLogTime < 1000) {
      console.log("🚫 Preventing duplicate activity log for:", requestKey);
      return;
    }

    global.activityLogCache.set(requestKey, now);

    // Cleanup cache setiap 5 menit
    if (global.activityLogCache.size > 1000) {
      const cutoffTime = now - 5 * 60 * 1000; // 5 menit
      for (const [key, time] of global.activityLogCache.entries()) {
        if (time < cutoffTime) {
          global.activityLogCache.delete(key);
        }
      }
    }

    // Extract informasi dari request dan response
    const adminId = req.admin.id_admin;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    // Get admin info untuk description yang lebih detail
    const { Admin } = require("../models");
    let adminInfo = null;
    try {
      adminInfo = await Admin.findByPk(adminId, {
        attributes: ["nama_lengkap", "username", "level_akses"],
      });
    } catch (error) {
      console.warn("Warning: Could not fetch admin info for activity log");
    }

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

      // Debug: Log response structure
      console.log("🔍 Activity Logger Debug - Response Data:", {
        hasData: !!parsedData.data,
        hasId: !!parsedData.id,
        dataKeys: parsedData.data ? Object.keys(parsedData.data) : null,
        directKeys: Object.keys(parsedData).slice(0, 10), // First 10 keys
        entity: entity,
        action: action,
      });

      // Cari data dari response
      if (parsedData.data) {
        const data = parsedData.data;
        entityId =
          data.id ||
          data.id_berita ||
          data.id_destinasi ||
          data.id_event ||
          data.id_umkm;
        entityName =
          data.judul ||
          data.nama ||
          data.title ||
          data.name ||
          data.nama_destinasi ||
          data.nama_event ||
          data.nama_umkm;
        newData = data;

        console.log("🔍 Extracted from parsedData.data:", {
          entityId,
          entityName,
        });
      } else if (parsedData.id) {
        entityId =
          parsedData.id ||
          parsedData.id_berita ||
          parsedData.id_destinasi ||
          parsedData.id_event;
        entityName =
          parsedData.judul ||
          parsedData.nama ||
          parsedData.title ||
          parsedData.name ||
          parsedData.nama_destinasi ||
          parsedData.nama_event ||
          parsedData.nama_umkm;
        newData = parsedData;

        console.log("🔍 Extracted from parsedData directly:", {
          entityId,
          entityName,
        });
      }
    }

    // Extract ID dari URL parameters jika tidak ada di response
    if (!entityId && req.params.id) {
      entityId = req.params.id;
    }

    // Fallback: ambil entityName dari originalData jika tidak ada di response (untuk update/delete)
    if (!entityName && oldData) {
      entityName =
        oldData.judul ||
        oldData.nama ||
        oldData.title ||
        oldData.name ||
        oldData.nama_destinasi ||
        oldData.nama_event ||
        oldData.nama_umkm;
      console.log("🔍 Fallback entityName from originalData:", entityName);
    }

    console.log("🔍 Final extraction result:", {
      entityId,
      entityName,
      hasOriginalData: !!oldData,
      entity,
      action,
    });

    // Generate description berdasarkan action dengan detail admin dan entity
    const adminName =
      adminInfo?.nama_lengkap || adminInfo?.username || `Admin ID ${adminId}`;
    const entityDisplayName = getEntityDisplayName(entity);

    switch (action) {
      case "create":
        if (entityName) {
          description = `${adminName} menambahkan ${entityDisplayName} baru "${entityName}"`;
        } else {
          description = `${adminName} menambahkan ${entityDisplayName} baru`;
        }
        break;
      case "update":
        if (entityName) {
          description = `${adminName} mengupdate/edit ${entityDisplayName} "${entityName}"`;
        } else {
          description = `${adminName} mengupdate ${entityDisplayName}`;
        }
        break;
      case "delete":
        if (entityName) {
          description = `${adminName} menghapus ${entityDisplayName} "${entityName}"`;
        } else {
          description = `${adminName} menghapus ${entityDisplayName}`;
        }
        break;
      case "upload":
        if (entityName) {
          description = `${adminName} mengunggah media untuk ${entityDisplayName} "${entityName}"`;
        } else {
          description = `${adminName} mengunggah media ke ${entityDisplayName}`;
        }
        break;
      case "login":
        description = `${adminName} login ke sistem`;
        break;
      case "logout":
        description = `${adminName} logout dari sistem`;
        break;
      default:
        description = `${adminName} melakukan ${action} pada ${entityDisplayName}`;
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
