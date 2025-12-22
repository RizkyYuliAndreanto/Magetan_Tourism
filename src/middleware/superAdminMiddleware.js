// src/middleware/superAdminMiddleware.js
const superAdminOnly = (req, res, next) => {
  // Pastikan user sudah terautentikasi
  if (!req.user || !req.user.level_akses) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required",
    });
  }

  // Cek apakah user adalah super admin
  if (req.user.level_akses !== "superadmin") {
    return res.status(403).json({
      message: "Forbidden: Super admin access required",
    });
  }

  next();
};

// Middleware untuk cek apakah akun diblokir
const checkBlockedUser = (req, res, next) => {
  if (req.user && req.user.is_blocked) {
    return res.status(403).json({
      message: "Account has been blocked. Please contact administrator.",
    });
  }
  next();
};

// Middleware kombinasi untuk cek auth + tidak diblokir
const authAndNotBlocked = (req, res, next) => {
  // Pastikan user sudah terautentikasi
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required",
    });
  }

  // Cek apakah akun diblokir
  if (req.user.is_blocked) {
    return res.status(403).json({
      message: "Account has been blocked. Please contact administrator.",
    });
  }

  next();
};

module.exports = {
  superAdminOnly,
  checkBlockedUser,
  authAndNotBlocked,
};
