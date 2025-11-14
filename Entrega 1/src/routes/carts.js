const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Rutas de carritos
// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === req.params.pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE producto específico
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT actualizar cantidad de producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = cart.products.find(p => p.product.toString() === req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no está en el carrito" });

    product.quantity = quantity;
    await cart.save();

    res.json({ message: "Cantidad actualizada", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT actualizar todo el carrito
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true });
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ message: "Carrito actualizado", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ message: "Carrito vaciado", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
