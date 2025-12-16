import UserModel from "../models/users.model.js";
import CartModel from "../models/carts.model.js";
import bcrypt from "bcrypt";

export default class UserDao {
    getUsers = async () => {
        try {
            const users = await UserModel.find().select("-password").lean();
            return users;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    getUserById = async (id) => {
        try {
            const user = await UserModel.findById(id).select("-password").lean();
            return user;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    };
    createUser = async (data) => {
        try {
            const { first_name, last_name, email, age, password } = data;
            if (!first_name || !last_name || !email || !password)
                return { error: "Faltan campos requeridos" };
        
            const existing = await UserModel.findOne({ email: email.toLowerCase() });
            if (existing) return { error: "Email ya registrado" };
            // hash de contraseña
            const hashed = bcrypt.hashSync(password, 10);
        
            // crear carrito vacío asociado
            const newCart = await CartModel.create({ products: [] });
            const cartId = newCart._id;
        
            const newUser = await UserModel.create({
                first_name, last_name,
                email: email.toLowerCase(),
                age,
                password: hashed,
                cart: cartId
            });
            return newUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    updateUser = async (id, toUpdate) => {
        try {
            if (toUpdate.password) {
                toUpdate.password = bcrypt.hashSync(toUpdate.password, 10);
            }
            const updated = await UserModel.findByIdAndUpdate(id, { $set: toUpdate }, { new: true }).select("-password");
            if (!updated) return { error: "Usuario no encontrado" };
            return updated;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    deleteUser = async (id) => {
        try {
            const deleted = await UserModel.findByIdAndDelete(id);
            if (!deleted) return { error: "Usuario no encontrado" };
            const cartId = deleted.cart;
            const deletedCart = await CartModel.findByIdAndDelete(cartId);
            if (!deletedCart) console.log("Carrito no encontrado, pero el usuario sí fue eliminado.");
            return deleted;

        } catch (error) {
            console.log(error);
            return null;
        }
    };
}