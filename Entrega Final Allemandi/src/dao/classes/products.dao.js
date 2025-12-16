import ProductModel from "../models/products.model.js";

export default class ProductDao {
    getProducts = async (params) => {
        try {
            const { limit = 10, page = 1, sort, query } = params;
        
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
        
            const result = await ProductModel.paginate(filter, options);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    getProductById = async (id) => {
        try {
            const Product = await ProductModel.findById(id);
            return Product;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    createProduct = async (data) => {
        try {
            const result = await ProductModel.create(data);
            return result;
        } catch (error) {
            console.error("ERROR EN CREATE PRODUCT:", error);
            return null;
        }
    };
    updateProduct = async (id, product) => {
        try {
            return await ProductModel.findByIdAndUpdate(
            id,
            { $set: product },
            { new: true }
            );
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    deleteProduct = async (productId) => {
        return await ProductModel.findByIdAndDelete(productId);
    };
}