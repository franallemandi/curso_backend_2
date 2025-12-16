import User from "../dao/classes/users.dao.js";
const userService = new User();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);  
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    if (newUser?.error) return res.status(400).json(newUser);
    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, { ...req.body });
    if (updatedUser?.error) return res.status(400).json(updatedUser);
    res.json({ message: "Usuario actualizado", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado", user: deletedUser });
  }
    catch (err) {
    res.status(500).json({ error: err.message });
  }
};