const express = require("express");
const router = express.Router();
//const path = require("path");
const Product = require("../models/Product");

//const productsFile = path.join(__dirname, "../data/products.json");
//const newProduct = new ProductManager(productsFile);

// Rutas de productos
// GET con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtros dinámicos
    let filter = {};
    if (query) {
      if (query === "available") {
        filter.status = true;
      } else {
        filter.category = query; // busca por categoría
      }
    }

    // Ordenamiento por precio
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});
// GET producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// POST nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "Producto creado", product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// PUT actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// DELETE eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado", product: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
