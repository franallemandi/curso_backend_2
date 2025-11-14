const express = require("express");
const router = express.Router();
const passport = require("../config/passport.config");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

// Login: validar credenciales y devolver JWT
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info ? info.message : "No autorizado" });

    // generar token
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    return res.json({ message: "Login OK", token });
  })(req, res, next);
});

// Current: protegida por passport-jwt; devuelve datos del usuario asociado al JWT
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  // passport pone el usuario en req.user
  res.json({ user: req.user });
});

module.exports = router;
