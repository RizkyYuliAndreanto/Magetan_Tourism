// src/middleware/authorize.js
const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.level_akses) {
      // Jika req.user tidak ada atau tidak memiliki level_akses, berarti tidak terautentikasi atau token rusak
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request." });
    }

    if (roles.length && !roles.includes(req.user.level_akses)) {
      // Jika peran tidak diizinkan, kembalikan 403 Forbidden
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have the required role." });
    }

    next();
  };
};

module.exports = authorize;
