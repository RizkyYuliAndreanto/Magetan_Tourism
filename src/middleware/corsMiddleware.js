// middlewares/corsMiddleware.js
const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // Ganti dengan domain frontend Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
