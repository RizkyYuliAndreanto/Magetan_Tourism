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
      .valid("superadmin", "editor", "contributor") // Sesuaikan jika ENUM Anda berbeda
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
    identifier: Joi.string().required(),
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
    email_pengunjung: Joi.string().email().optional().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Kategori Berita Validators ---
const validateKategoriBeritaCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(2).max(100).required(),
    deskripsi_kategori: Joi.string().max(500).optional().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateKategoriBeritaUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(2).max(100).optional(),
    deskripsi_kategori: Joi.string().max(500).optional().allow(null, ""),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Berita Validators ---
const validateBeritaCreation = (req, res, next) => {
  const schema = Joi.object({
    judul: Joi.string().min(5).max(255).required(),
    teras_berita: Joi.string().min(10).required(),
    isi_berita: Joi.string().min(20).required(),
    penutup_berita: Joi.string().optional().allow(null, ""),
    tanggal_publikasi: Joi.date().iso().required(), // Format ISO 8601
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    zoom_level_peta: Joi.number()
      .integer()
      .min(1)
      .max(20)
      .optional()
      .allow(null),
    jumlah_dilihat: Joi.number().integer().min(0).optional().default(0),
    jumlah_share: Joi.number().integer().min(0).optional().default(0),
    id_kategori: Joi.number().integer().positive().required(),
    // gambar_hero_berita divalidasi oleh Multer dan keberadaan path di controller
    // id_admin diambil dari req.user, tidak divalidasi di sini
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateBeritaUpdate = (req, res, next) => {
  const schema = Joi.object({
    judul: Joi.string().min(5).max(255).optional(),
    teras_berita: Joi.string().min(10).optional(),
    isi_berita: Joi.string().min(20).optional(),
    penutup_berita: Joi.string().optional().allow(null, ""),
    tanggal_publikasi: Joi.date().iso().optional(),
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    zoom_level_peta: Joi.number()
      .integer()
      .min(1)
      .max(20)
      .optional()
      .allow(null),
    jumlah_dilihat: Joi.number().integer().min(0).optional(),
    jumlah_share: Joi.number().integer().min(0).optional(),
    id_kategori: Joi.number().integer().positive().optional(),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Destinasi Validators ---
const validateDestinasiCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_destinasi: Joi.string().min(3).max(255).required(),
    deskripsi_destinasi: Joi.string().min(10).required(),
    alamat: Joi.string().min(5).required(),
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    jam_operasional: Joi.string().max(100).optional().allow(null, ""),
    harga_tiket: Joi.number().precision(2).min(0).optional().allow(null),
    jumlah_dilihat: Joi.number().integer().min(0).optional().default(0),
    jumlah_share: Joi.number().integer().min(0).optional().default(0),
    id_kategori_destinasi: Joi.number().integer().positive().required(),
    // gambar_utama divalidasi oleh Multer
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateDestinasiUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_destinasi: Joi.string().min(3).max(255).optional(),
    deskripsi_destinasi: Joi.string().min(10).optional(),
    alamat: Joi.string().min(5).optional(),
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    jam_operasional: Joi.string().max(100).optional().allow(null, ""),
    harga_tiket: Joi.number().precision(2).min(0).optional().allow(null),
    jumlah_dilihat: Joi.number().integer().min(0).optional(),
    jumlah_share: Joi.number().integer().min(0).optional(),
    id_kategori_destinasi: Joi.number().integer().positive().optional(),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Event Validators ---
const validateEventCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_event: Joi.string().min(3).max(255).required(),
    deskripsi_event: Joi.string().min(10).required(),
    tanggal_mulai: Joi.date().iso().required(),
    tanggal_selesai: Joi.date().iso().required().min(Joi.ref("tanggal_mulai")), // tanggal_selesai harus setelah atau sama dengan tanggal_mulai
    lokasi_event: Joi.string().min(5).required(),
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    jumlah_dilihat: Joi.number().integer().min(0).optional().default(0),
    jumlah_share: Joi.number().integer().min(0).optional().default(0),
    // gambar_event dan brosur_event divalidasi oleh Multer
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateEventUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_event: Joi.string().min(3).max(255).optional(),
    deskripsi_event: Joi.string().min(10).optional(),
    tanggal_mulai: Joi.date().iso().optional(),
    tanggal_selesai: Joi.date().iso().optional().min(Joi.ref("tanggal_mulai")),
    lokasi_event: Joi.string().min(5).optional(),
    koordinat_lokasi: Joi.string()
      .pattern(
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
      .optional()
      .allow(null, ""),
    jumlah_dilihat: Joi.number().integer().min(0).optional(),
    jumlah_share: Joi.number().integer().min(0).optional(),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Kategori Destinasi Validators ---
const validateKategoriDestinasiCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(2).max(100).required(),
    deskripsi_kategori: Joi.string().max(500).optional().allow(null, ""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateKategoriDestinasiUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(2).max(100).optional(),
    deskripsi_kategori: Joi.string().max(500).optional().allow(null, ""),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Media Galeri Validators ---
const validateMediaGaleriCreation = (req, res, next) => {
  const schema = Joi.object({
    id_konten: Joi.number().integer().positive().required(),
    tipe_konten: Joi.string()
      .valid(
        "berita",
        "destinasi",
        "sejarah",
        "event",
        "umkm",
        "akomodasi",
        "ppid_konten"
      )
      .required(), // Sesuaikan dengan ENUM di model Media_Galeri
    deskripsi_file: Joi.string().max(255).optional().allow(null, ""),
    jenis_file: Joi.string().valid("gambar", "video").required(),
    urutan_tampil: Joi.number().integer().min(0).optional().default(0),
    // path_file divalidasi keberadaan di controller
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateMediaGaleriUpdate = (req, res, next) => {
  const schema = Joi.object({
    id_konten: Joi.number().integer().positive().optional(),
    tipe_konten: Joi.string()
      .valid(
        "berita",
        "destinasi",
        "sejarah",
        "event",
        "umkm",
        "akomodasi",
        "ppid_konten"
      )
      .optional(),
    deskripsi_file: Joi.string().max(255).optional().allow(null, ""),
    jenis_file: Joi.string().valid("gambar", "video").optional(),
    urutan_tampil: Joi.number().integer().min(0).optional(),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Struktur Anggota Validators ---
const validateStrukturAnggotaCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_anggota: Joi.string().min(3).max(255).required(),
    jabatan: Joi.string().min(3).max(100).required(),
    deskripsi_tugas: Joi.string().optional().allow(null, ""),
    urutan_tampilan: Joi.number().integer().min(0).optional().default(0),
    // foto_anggota divalidasi oleh Multer
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateStrukturAnggotaUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_anggota: Joi.string().min(3).max(255).optional(),
    jabatan: Joi.string().min(3).max(100).optional(),
    deskripsi_tugas: Joi.string().optional().allow(null, ""),
    urutan_tampilan: Joi.number().integer().min(0).optional(),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Pengumuman Validators ---
const validatePengumumanCreation = (req, res, next) => {
  const schema = Joi.object({
    judul_pengumuman: Joi.string().min(5).max(255).required(),
    isi_pengumuman: Joi.string().optional().allow(null, ""), // Opsional di model
    // file_pdf_path divalidasi oleh Multer dan keberadaan di controller
    // tanggal_publikasi otomatis
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validatePengumumanUpdate = (req, res, next) => {
  const schema = Joi.object({
    judul_pengumuman: Joi.string().min(5).max(255).optional(),
    isi_pengumuman: Joi.string().optional().allow(null, ""),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Visi Misi Validators ---
const validateVisiMisiCreation = (req, res, next) => {
  const schema = Joi.object({
    // visi_misi_file_path divalidasi oleh Multer dan controller
    // tipe_file_visi_misi divalidasi oleh controller berdasarkan mime
    deskripsi: Joi.string().min(10).optional().allow(null, ""), // Kolom teks deskripsi
    // tanggal_pembaruan otomatis
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateVisiMisiUpdate = (req, res, next) => {
  const schema = Joi.object({
    deskripsi: Joi.string().min(10).optional().allow(null, ""),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Struktur Organisasi Validators ---
const validateStrukturOrganisasiCreation = (req, res, next) => {
  const schema = Joi.object({
    judul_struktur: Joi.string().min(3).max(255).required(),
    deskripsi_struktur: Joi.string().optional().allow(null, ""),
    // gambar_struktur_path divalidasi oleh Multer dan controller
    // tanggal_pembaruan otomatis
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateStrukturOrganisasiUpdate = (req, res, next) => {
  const schema = Joi.object({
    judul_struktur: Joi.string().min(3).max(255).optional(),
    deskripsi_struktur: Joi.string().optional().allow(null, ""),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Kategori PPID Validators ---
const validateKategoriPpidCreation = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(3).max(255).required(),
    deskripsi_kategori: Joi.string().optional().allow(null, ""),
    id_kategori_induk: Joi.number().integer().positive().optional().allow(null),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateKategoriPpidUpdate = (req, res, next) => {
  const schema = Joi.object({
    nama_kategori: Joi.string().min(3).max(255).optional(),
    deskripsi_kategori: Joi.string().optional().allow(null, ""),
    id_kategori_induk: Joi.number().integer().positive().optional().allow(null),
  }).min(1);
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// --- Konten PPID Validators ---
const validateKontenPpidCreation = (req, res, next) => {
  const schema = Joi.object({
    judul_konten: Joi.string().min(5).max(255).required(),
    deskripsi_konten: Joi.string().optional().allow(null, ""),
    id_kategori_ppid: Joi.number().integer().positive().required(),
    // file_pdf_path dan gambar_ppid_galeri divalidasi keberadaan di controller setelah Multer
    // tanggal_publikasi otomatis
    // id_admin diambil dari req.user
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateKontenPpidUpdate = (req, res, next) => {
  const schema = Joi.object({
    judul_konten: Joi.string().min(5).max(255).optional(),
    deskripsi_konten: Joi.string().optional().allow(null, ""),
    id_kategori_ppid: Joi.number().integer().positive().optional(),
  }).min(1);
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
  validateKategoriBeritaCreation,
  validateKategoriBeritaUpdate,
  validateBeritaCreation,
  validateBeritaUpdate,
  validateDestinasiCreation, // Sudah ada di kode sebelumnya
  validateDestinasiUpdate, // Sudah ada di kode sebelumnya
  validateEventCreation,
  validateEventUpdate,
  validateKategoriDestinasiCreation, // BARU
  validateKategoriDestinasiUpdate, // BARU
  validateMediaGaleriCreation,
  validateMediaGaleriUpdate,
  validateStrukturAnggotaCreation,
  validateStrukturAnggotaUpdate,
  validatePengumumanCreation,
  validatePengumumanUpdate,
  validateVisiMisiCreation,
  validateVisiMisiUpdate,
  validateStrukturOrganisasiCreation,
  validateStrukturOrganisasiUpdate,
  validateKategoriPpidCreation,
  validateKategoriPpidUpdate,
  validateKontenPpidCreation,
  validateKontenPpidUpdate,
};
