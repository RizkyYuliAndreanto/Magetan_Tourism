// middlewares/xssSanitizationMiddleware.js
const xss = require("xss");

const sanitizeXss = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};

module.exports = sanitizeXss;
