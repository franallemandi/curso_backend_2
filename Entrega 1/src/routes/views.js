const express = require("express");
const router = express.Router();
const path = require("path");

//Entrega final
const Product = require("../models/Product");
const Cart = require("../models/Cart");
//-----------------

const productsFile = path.join(__dirname, "../data/products.json");
//const productManager = new ProductManager(productsFile);

// Ruta home
router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("home", { products });
});

// Ruta realtimeproducts
router.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find().lean();
  res.render("realTimeProducts", { products });
});

//Nueva ruta products en Entrega Final
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      if (query === "available") filter.status = true;
      else filter.category = query;
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = { page, limit, sort: sortOption, lean: true };

    const result = await Product.paginate(filter, options);

    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});
//Vista de Detalle de Producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productDetail", { product });
  } catch (err) {
    res.status(500).send("Error al cargar producto");
  }
});
//Vista de Carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cartDetail", { cart });
  } catch (err) {
    res.status(500).send("Error al cargar carrito");
  }
});


module.exports = router;
