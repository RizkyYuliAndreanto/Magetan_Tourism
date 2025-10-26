// middlewares/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20, // Maksimal 20 permintaan per 15 menit per IP
  message:
    "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.",
  standardHeaders: true, // Kembali ke header standar RateLimit-*
  legacyHeaders: false, // Nonaktifkan header X-RateLimit-*
});

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit (lebih singkat untuk development)
  max: 50, // Maksimal 50 percobaan login per 5 menit per IP (lebih longgar untuk development)
  message:
    "Terlalu banyak percobaan login yang gagal dari IP ini, silakan coba lagi setelah 5 menit.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  loginLimiter,
};
