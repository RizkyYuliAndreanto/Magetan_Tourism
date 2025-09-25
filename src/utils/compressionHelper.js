// src/utils/compressionHelper.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

class CompressionHelper {
  /**
   * Kompresi gambar menggunakan sharp
   * @param {object} file - File object dari multer
   * @param {number} maxSize - Ukuran maksimal dalam bytes (default 10MB)
   * @param {number} quality - Kualitas kompresi (1-100, default 70)
   * @returns {object} - File object yang sudah dikompresi
   */
  static async compressImage(file, maxSize = 1024 * 1024 * 10, quality = 70) {
    if (!file || !file.mimetype.startsWith("image/")) {
      return file;
    }

    // Jika file size sudah di bawah limit, return file asli
    if (file.size <= maxSize) {
      return file;
    }

    try {
      const inputPath = file.path;
      const ext = path.extname(file.originalname);
      const outputPath = inputPath.replace(ext, `-compressed.jpg`);

      // Kompresi gambar
      await sharp(inputPath).jpeg({ quality }).toFile(outputPath);

      // Hapus file asli
      fs.unlinkSync(inputPath);

      // Update file object
      file.path = outputPath;
      file.filename = path.basename(outputPath);
      file.size = fs.statSync(outputPath).size;
      file.mimetype = "image/jpeg";

      console.log(`Image compressed: ${inputPath} -> ${outputPath}`);
      return file;
    } catch (error) {
      console.error("Gagal kompresi gambar:", error.message);
      return file; // Return file asli jika gagal kompresi
    }
  }

  /**
   * Kompresi multiple gambar
   * @param {object[]} files - Array file objects dari multer
   * @param {number} maxSize - Ukuran maksimal dalam bytes
   * @param {number} quality - Kualitas kompresi
   * @returns {object[]} - Array file objects yang sudah dikompresi
   */
  static async compressImages(files, maxSize = 1024 * 1024 * 10, quality = 70) {
    if (!Array.isArray(files)) return files;

    const compressedFiles = await Promise.all(
      files.map((file) => this.compressImage(file, maxSize, quality))
    );

    return compressedFiles;
  }

  /**
   * Kompresi berdasarkan field name
   * @param {object} reqFiles - req.files object dari multer
   * @param {object} compressionRules - Rules kompresi per field
   * @returns {object} - req.files object yang sudah dikompresi
   */
  static async compressFilesByField(reqFiles, compressionRules = {}) {
    if (!reqFiles) return reqFiles;

    const defaultRules = {
      // Gambar umum
      gambar_hero_berita: { maxSize: 1024 * 1024 * 10, quality: 70 },
      gambar_event: { maxSize: 1024 * 1024 * 10, quality: 70 },
      gambar_utama: { maxSize: 1024 * 1024 * 10, quality: 70 },
      gambar_produk_utama: { maxSize: 1024 * 1024 * 5, quality: 75 },
      foto_anggota: { maxSize: 1024 * 1024 * 2, quality: 80 },
      gambar_struktur_organisasi: { maxSize: 1024 * 1024 * 5, quality: 75 },
      media_galeri_file: { maxSize: 1024 * 1024 * 8, quality: 70 },
      // Bisa ditambah field lainnya
    };

    const rules = { ...defaultRules, ...compressionRules };

    for (const fieldName in reqFiles) {
      const files = reqFiles[fieldName];
      const rule = rules[fieldName];

      if (rule && Array.isArray(files)) {
        reqFiles[fieldName] = await this.compressImages(
          files,
          rule.maxSize,
          rule.quality
        );
      }
    }

    return reqFiles;
  }

  /**
   * Resize gambar ke dimensi tertentu
   * @param {object} file - File object dari multer
   * @param {number} width - Lebar target
   * @param {number} height - Tinggi target
   * @param {object} options - Opsi sharp lainnya
   * @returns {object} - File object yang sudah diresize
   */
  static async resizeImage(file, width, height, options = {}) {
    if (!file || !file.mimetype.startsWith("image/")) {
      return file;
    }

    try {
      const inputPath = file.path;
      const ext = path.extname(file.originalname);
      const outputPath = inputPath.replace(ext, `-resized${ext}`);

      const sharpInstance = sharp(inputPath);

      if (width || height) {
        sharpInstance.resize(width, height, {
          fit: options.fit || "cover",
          position: options.position || "center",
          ...options,
        });
      }

      await sharpInstance.toFile(outputPath);

      // Hapus file asli
      fs.unlinkSync(inputPath);

      // Update file object
      file.path = outputPath;
      file.filename = path.basename(outputPath);
      file.size = fs.statSync(outputPath).size;

      console.log(`Image resized: ${inputPath} -> ${outputPath}`);
      return file;
    } catch (error) {
      console.error("Gagal resize gambar:", error.message);
      return file;
    }
  }

  /**
   * Generate thumbnail dari gambar
   * @param {object} file - File object dari multer
   * @param {number} size - Ukuran thumbnail (square)
   * @returns {string} - Path thumbnail yang dihasilkan
   */
  static async generateThumbnail(file, size = 150) {
    if (!file || !file.mimetype.startsWith("image/")) {
      return null;
    }

    try {
      const inputPath = file.path;
      const dir = path.dirname(inputPath);
      const name = path.basename(inputPath, path.extname(inputPath));
      const thumbnailPath = path.join(dir, `${name}_thumb.jpg`);

      await sharp(inputPath)
        .resize(size, size, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      console.log(`Thumbnail generated: ${thumbnailPath}`);
      return thumbnailPath.replace(__dirname + "../../../", "/");
    } catch (error) {
      console.error("Gagal generate thumbnail:", error.message);
      return null;
    }
  }
}

module.exports = CompressionHelper;
