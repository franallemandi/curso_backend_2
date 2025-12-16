import Product from "../dao/classes/products.dao.js";
const productService = new Product();

export const getProducts = async (req, res) => {
  try {
        const products = await productService.getProducts(req.query);
        if (!products) {
            return res.status(404).json({ error: "No se encontraron productos" });
        }
        res.status(200).json({
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
            });
    } catch (err) {
        console.error("Error al mostrar productos:", err);
        res.status(500).json({ error: err.message });
    }
};
export const getProductById = async (req, res) => {
  try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(product);
    } catch (err) {
        console.error("Error al obtener producto:", err);
        res.status(500).json({ error: err.message });
    }
};
export const createProduct = async (req, res) => {
  try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({ message: "Producto creado", product: newProduct });
    } catch (err) {
        console.error("Error al crear producto:", err);
        res.status(500).json({ error: err.message });
    }
};
export const updateProduct = async (req, res) => {
  try {
        const updated = await productService.updateProduct(req.params.pid, req.body);   
        if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto actualizado", product: updated });
    } catch (err) {
        console.error("Error al actualizar producto:", err);
        res.status(500).json({ error: err.message });
    }
};
export const deleteProduct = async (req, res) => {
  try {
        const deleted = await productService.deleteProduct(req.params.pid);
        if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ message: "Producto eliminado", product: deleted });
    } catch (err) {
        console.error("Error al eliminar producto:", err);
        res.status(500).json({ error: err.message });
    }
};

