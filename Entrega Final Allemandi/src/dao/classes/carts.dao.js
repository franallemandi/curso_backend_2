import CartModel from "../models/carts.model.js";
import ProductModel from "../models/products.model.js"; 

export default class CartDao {
    getCarts = async () => {
        try {
            const Cart = await CartModel.find();
            return Cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    getCartById = async (id) => {
        try {
            const Cart = await CartModel.findById(id).populate("products.product");
            return Cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    createCart = async (data) => {
        try {
            const result = await CartModel.create(data);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    updateCart = async (id, products) => {
        try {
            return await CartModel.findByIdAndUpdate(
            id,
            { $set: {products} },
            { new: true }
            ).populate("products.product");
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    clearCart = async (id) => {   
        try {
            const result = await CartModel.updateOne(
                { _id: id },
                { $set: { products: [] } }
                );
            return await this.getCartById(id);
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    addProduct = async (cartId, productId, quantity = 1) => {
        try {
            const cart = await CartModel.findById(cartId);;
            if (!cart) return null;
            const product = await ProductModel.findById(productId);
            if (!product) return null;
            const existing = cart.products.find(p => p.product.toString() === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    deleteProduct = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);;
            if (!cart) return null;
            const product = cart.products.find(p => p.product.toString() === productId);
            if (!product) return null;
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await CartModel.findById(cartId);;
            if (!cart) return null;
            const product = cart.products.find(p => p.product.toString() === productId);
            if (!product) return null;
            product.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
}