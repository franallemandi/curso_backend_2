import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../dao/models/users.model.js";
import bcrypt from "bcrypt";

// JWT strategy config
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "pw_123"
};

// JWT strategy: validate user from token
passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id)
        .select("-password")
        .lean();
      if (!user) return done(null, false, { message: "Token no válido" });
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Local strategy: login with email + password
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return done(null, false, { message: "Usuario no encontrado" });

      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

      const safeUser = user.toObject();
      delete safeUser.password;

      return done(null, safeUser);
    } catch (err) {
      return done(err);
    }
  })
);


export default passport;
