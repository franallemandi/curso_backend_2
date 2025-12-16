// ---------------------
//Importaciones y configuración básica
// ---------------------
import express from "express";
import config from "./config/config.js";
import cors from "cors";
import userRoutes from "./routes/users.router.js";
import productRoutes from "./routes/products.router.js";
import cartRoutes from "./routes/carts.router.js";
import connectDb from "./database/database.js";
import passport from "./config/passport.config.js";
import ProductDao from "./dao/classes/products.dao.js"; 
import path from "path";
import http from "http";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const productService = new ProductDao();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// ---------------------
//Inicialización del servidor y Socket.io
// ---------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---------------------
// Middlewares
// ---------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());

// ---------------------
// Configuración de Handlebars
// ---------------------
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Conexión a la base de datos
connectDb(process.env.MONGODB_URL);

// ---------------------
// Rutas
// ---------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// ---------------------
// WebSockets (Socket.io)
// ---------------------
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Enviar lista inicial
  const products = await productService.getProducts({});
  socket.emit("updateProducts", products.docs);

  // Agregar productos en tiempo real
  socket.on("newProduct", async (data) => {
    try {
      console.log("Nuevo producto recibido:", data);
      await productService.createProduct(data);
      const updatedProducts = await productService.getProducts({});
      io.emit("updateProducts", updatedProducts.docs);
    } catch (err) {
      console.error("Error al agregar producto:", err.message);
      socket.emit("errorMessage", err.message);
    }
  });

  //Eliminar productos en tiempo real
  socket.on("deleteProduct", async (id) => {
    try {
      await productService.deleteProduct(id);
      const updatedProducts = await productService.getProducts({});
      io.emit("updateProducts", updatedProducts);
    } catch (err) {
      console.error("Error al eliminar producto:", err.message);
      socket.emit("errorMessage", err.message);
    }
  });
});



// ---------------------
// Iniciar servidor
// ---------------------
app.set("PORT", config.port || 4000);
server.listen(app.get("PORT"), () => {
  console.log(`Server running on http://localhost:${app.get("PORT")}`);
});
