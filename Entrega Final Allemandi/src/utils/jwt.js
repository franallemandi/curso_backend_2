const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET || "pw_123", { expiresIn: JWT_EXPIRES_IN || "1h" });
}

module.exports = { generateToken };
