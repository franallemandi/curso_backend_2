// ---------------------
//Importaciones y configuración básica
// ---------------------
const express = require("express");
require("dotenv").config();


//Añadiendo Mongoose
const mongoose = require("mongoose");

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");

const ProductManager = require("./managers/ProductManager");
const productsFile = path.join(__dirname, "data/products.json");
const productManager = new ProductManager(productsFile);

const Product = require("./models/Product");

//Añadiendo passport
const passport = require("./config/passport.config");


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
app.use(passport.initialize());

//Mongoose Conexión
mongoose.connect("mongodb+srv://francoaallemandi_db_user:e86iweUzTx6WujPa@cluster0.ag8e0nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
  console.log("Conectado a la Base de Datos de Mongo Atlas")
})
.catch(error => {console.error("La conexión no se ha podido realizar.", error)})

// ---------------------
// Configuración de Handlebars
// ---------------------
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ---------------------
// Rutas
// ---------------------
const viewsRouter = require("./routes/views");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const usersRouter = require("./routes/users");
const sessionsRouter = require("./routes/sessions");
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);  
app.use("/api/carts", cartsRouter);        
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

// ---------------------
// WebSockets (Socket.io)
// ---------------------
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Enviar lista inicial
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);

  // Agregar productos en tiempo real
  socket.on("newProduct", async (data) => {
    try {
      console.log("Nuevo producto recibido:", data);
      await Product.create(data);
      const updatedProducts = await Product.find().lean();
      io.emit("updateProducts", updatedProducts);
    } catch (err) {
      console.error("Error al agregar producto:", err.message);
      socket.emit("errorMessage", err.message);
    }
  });

  //Eliminar productos en tiempo real
  socket.on("deleteProduct", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const updatedProducts = await Product.find().lean();
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
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
