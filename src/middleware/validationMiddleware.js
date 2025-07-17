// middlewares/validationMiddleware.js
const Joi = require("joi");

// --- Admin Validators ---
const validateAdminCreation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    nama_lengkap: Joi.string().required(),
    email: Joi.string().email().required(),
    level_akses: Joi.string()
      .valid("superadmin", "editor", "contributor")
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateAdminLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Pengunjung Validators ---
const validatePengunjungRegistration = (req, res, next) => {
  const schema = Joi.object({
    nama_pengunjung: Joi.string().min(3).max(100).optional().default("Anonim"),
    email_pengunjung: Joi.string().email().optional(), // Opsional
    // ip_address akan diambil dari req, bukan dari body
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateAdminCreation,
  validateAdminLogin,
  validatePengunjungRegistration,
  // ...validator lainnya jika ada
};
