const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/Users");
const bcrypt = require("bcrypt");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "pw_123"
};

// JWT strategy: extraer usuario desde token
passport.use("jwt", new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select("-password").lean();
    if (!user) return done(null, false, { message: "Token no válido" });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

// Local strategy: login con email + password
passport.use("local", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return done(null, false, { message: "Usuario no encontrado" });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

    // Devolver usuario sin password
    const safeUser = user.toObject();
    delete safeUser.password;
    return done(null, safeUser);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
