import Cart from "../dao/classes/carts.dao.js";
import Product from  "../dao/classes/products.dao.js";
import TicketsDAO from "../dao/classes/tickets.dao.js";
import { v4 as uuidv4 } from "uuid";
const cartService = new Cart();
const productService = new Product();
const ticketsDao = new TicketsDAO();

export const createCart = async (req, res) => {
  try {
        const newCart = await cartService.createCart();
        res.status(201).json({ message: "Carrito creado", cart: newCart });
    } catch (err) {
        console.error("Error al crear carrito:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getCartById = async (req, res) => {
  try {
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (err) {
        console.error("Error al obtener carrito:", err);
        res.status(500).json({ error: err.message });
    }
};

export const addProduct = async (req, res) => {
  try {
    const result = await cartService.addProduct(req.params.cid, req.params.pid);
    if (!result) return res.status(404).json({ error: "Carrito o producto no encontrados" });

    res.json({ message: "Producto agregado al carrito", cart: result });
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
      const cart = await cartService.deleteProduct(req.params.cid, req.params.pid);
      if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrados" });
  
      res.json({ message: "Producto eliminado del carrito", cart });
    } catch (err) {
        console.error("Error al eliminar producto del carrito:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateProductQuantity = async (req, res) => {
  try {
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, quantity);
      if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
  
      res.json({ message: "Cantidad actualizada", cart });
    } catch (err) {
        console.error("Error al actualizar cantidad:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateCart = async (req, res) => {
  try {
      const { products } = req.body;
      const cart = await cartService.updateCart(req.params.cid, products);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  
      res.json({ message: "Carrito actualizado", cart });
    } catch (err) {
        console.error("Error al actualizar carrito:", err);
        res.status(500).json({ error: err.message });
    }   
};

export const clearCart = async (req, res) => {
  try {
      const cart = await cartService.clearCart(req.params.cid);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  
      res.json({ message: "Carrito vaciado", cart });
    } catch (err) {
        console.error("Error al vaciar carrito:", err);
        res.status(500).json({ error: err.message });
    }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const { purchaserEmail } = req.body;
    if (!purchaserEmail) {
      return res.status(400).json({ error: "purchaserEmail es requerido" });
    }

    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    let totalAmount = 0;
    const productsPurchased = [];
    const productsNotProcessed = [];

    for (const item of cart.products) {
      const product = await productService.getProductById(
        item.product._id || item.product
      );

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;
        productsPurchased.push(item.product);
      } else {
        productsNotProcessed.push(item.product);
      }
    }

    let ticket = null;

    if (productsPurchased.length > 0) {
      ticket = await ticketsDao.createTicket({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: purchaserEmail
      });

      cart.products = cart.products.filter(
        p =>
          !productsPurchased.some(
            bought =>
              bought.toString() === p.product.toString()
          )
      );

      await cart.save();
    }

    res.json({
      status: "success",
      ticket,
      productsNotProcessed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};