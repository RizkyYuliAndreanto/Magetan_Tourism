// middlewares/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 permintaan per 15 menit per IP
  message:
    "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.",
  standardHeaders: true, // Kembali ke header standar RateLimit-*
  legacyHeaders: false, // Nonaktifkan header X-RateLimit-*
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 percobaan login gagal per 15 menit per IP
  message:
    "Terlalu banyak percobaan login yang gagal dari IP ini, silakan coba lagi setelah 15 menit.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  loginLimiter,
};
