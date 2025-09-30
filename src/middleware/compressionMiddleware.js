// src/middleware/compressionMiddleware.js
const CompressionHelper = require("../utils/compressionHelper");

/**
 * Middleware untuk kompresi otomatis file upload
 * @param {object} options - Opsi konfigurasi kompresi
 */
const compressionMiddleware = (options = {}) => {
  return async (req, res, next) => {
    try {
      // Jika tidak ada file yang diupload, lanjut ke next
      if (!req.files || Object.keys(req.files).length === 0) {
        return next();
      }

      // Kompresi files berdasarkan field name dan rules
      req.files = await CompressionHelper.compressFilesByField(
        req.files,
        options
      );

      next();
    } catch (error) {
      console.error("Error in compression middleware:", error);
      // Jika error kompresi, tetap lanjut dengan file asli
      next();
    }
  };
};

module.exports = compressionMiddleware;
