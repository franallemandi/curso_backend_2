const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Cart = require("../models/Cart");

// Create user (register)
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email ya registrado" });

    // hash de contraseña
    const hashed = bcrypt.hashSync(password, 10);

    // crear carrito vacío asociado
    const newCart = await Cart.create({ products: [] });
    const cartId = newCart._id;

    const newUser = await User.create({
      first_name, last_name,
      email: email.toLowerCase(),
      age,
      password: hashed,
      cart: cartId
    });

    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const toUpdate = { ...req.body };
    if (toUpdate.password) {
      toUpdate.password = bcrypt.hashSync(toUpdate.password, 10);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, toUpdate, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado", user: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
