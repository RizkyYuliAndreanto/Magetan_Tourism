// src/utils/fileHelper.js
const fs = require("fs");
const path = require("path");

class FileHelper {
  /**
   * Hapus file fisik dari filesystem
   * @param {string} filePath - Path file yang akan dihapus
   * @returns {boolean} - True jika berhasil, false jika gagal
   */
  static deleteFile(filePath) {
    try {
      if (!filePath) return true;

      // Jika path dimulai dengan /uploads, ubah ke path absolut
      let fullPath = filePath;
      if (filePath.startsWith("/uploads/")) {
        fullPath = path.join(
          __dirname,
          "..",
          "..",
          filePath.replace("/uploads/", "uploads/")
        );
      }

      // Cek apakah file ada
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`File deleted: ${fullPath}`);
        return true;
      }
      return true; // File tidak ada, anggap sudah terhapus
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Hapus multiple files
   * @param {string[]} filePaths - Array path file yang akan dihapus
   * @returns {boolean} - True jika semua berhasil
   */
  static deleteMultipleFiles(filePaths) {
    if (!Array.isArray(filePaths)) return true;

    let allSuccess = true;
    filePaths.forEach((filePath) => {
      if (filePath && !this.deleteFile(filePath)) {
        allSuccess = false;
      }
    });

    return allSuccess;
  }

  /**
   * Hapus file gambar lama saat update
   * @param {object} oldData - Data lama yang berisi path file
   * @param {object} newData - Data baru
   * @param {string[]} fileFields - Field yang berisi path file
   */
  static deleteOldFiles(oldData, newData, fileFields) {
    fileFields.forEach((field) => {
      // Jika ada file baru dan berbeda dari file lama, hapus file lama
      if (
        newData[field] &&
        oldData[field] &&
        newData[field] !== oldData[field]
      ) {
        this.deleteFile(oldData[field]);
      }
    });
  }

  /**
   * Get file info dari path
   * @param {string} filePath - Path file
   * @returns {object} - Info file (size, extension, dll)
   */
  static getFileInfo(filePath) {
    try {
      if (!filePath) return null;

      let fullPath = filePath;
      if (filePath.startsWith("/uploads/")) {
        fullPath = path.join(
          __dirname,
          "..",
          "..",
          filePath.replace("/uploads/", "uploads/")
        );
      }

      if (!fs.existsSync(fullPath)) return null;

      const stats = fs.statSync(fullPath);
      const ext = path.extname(filePath);

      return {
        path: filePath,
        size: stats.size,
        extension: ext,
        mimeType: this.getMimeType(ext),
        exists: true,
      };
    } catch (error) {
      console.error(`Error getting file info ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get mime type dari extension
   * @param {string} ext - Extension file
   * @returns {string} - Mime type
   */
  static getMimeType(ext) {
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".ogg": "video/ogg",
    };

    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Bersihkan folder dari file yang tidak digunakan
   * @param {string} folderPath - Path folder
   * @param {string[]} usedFiles - Array file yang masih digunakan
   */
  static cleanupFolder(folderPath, usedFiles = []) {
    try {
      const fullFolderPath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        folderPath
      );

      if (!fs.existsSync(fullFolderPath)) return;

      const files = fs.readdirSync(fullFolderPath);

      files.forEach((file) => {
        const filePath = `/uploads/${folderPath}/${file}`;
        if (!usedFiles.includes(filePath)) {
          this.deleteFile(filePath);
        }
      });
    } catch (error) {
      console.error(`Error cleaning folder ${folderPath}:`, error);
    }
  }
}

module.exports = FileHelper;
