import { Router } from "express";
import {
    createCart,
    getCartById,
    addProduct,
    deleteProduct,
    updateProductQuantity,
    updateCart,
    clearCart
} from "../controllers/carts.controller.js";
import { purchaseCart } from "../controllers/carts.controller.js";
const router = Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/products/:pid", addProduct);
router.delete("/:cid/products/:pid", deleteProduct); 
router.put("/:cid/products/:pid", updateProductQuantity); 
router.put("/:cid",updateCart); 
router.delete("/:cid", clearCart); 
router.post("/:cid/purchase", purchaseCart);

export default router;
