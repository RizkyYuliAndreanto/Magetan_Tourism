// middlewares/requestLogger.js
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Buat stream tulis untuk file log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../access.log"),
  { flags: "a" }
);

// Setup the logger
const requestLogger = morgan("combined", { stream: accessLogStream });

module.exports = requestLogger;
