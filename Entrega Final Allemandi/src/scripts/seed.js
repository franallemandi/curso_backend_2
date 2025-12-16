// scripts/seed.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
//require('dotenv').config();

async function seed() {
  await mongoose.connect("mongodb+srv://francoaallemandi_db_user:e86iweUzTx6WujPa@cluster0.ag8e0nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  await Product.deleteMany({});

  const products = [
    { title: "Auriculares Inalámbricos", description:"Bluetooth", code:"AUR1", price:4500, status:true, stock:35, category:"Electrónica", thumbnails:[] },
    { title: "Mouse Gamer", description:"RGB", code:"MOU1", price:7500, status:true, stock:20, category:"Electrónica", thumbnails:[] },
    { title: "Camiseta", description:"Algodón", code:"CAM1", price:2500, status:true, stock:50, category:"Ropa", thumbnails:[] },
    { title: "Libro JS", description:"Aprende JS", code:"LIB1", price:1800, status:true, stock:10, category:"Libros", thumbnails:[] },
    { title: "Producto Agotado", description:"Sin stock", code:"OUT1", price:1000, status:false, stock:0, category:"Varios", thumbnails:[] },
    { title: "Auricular Pro", description:"Alta gama", code:"AUR2", price:12000, status:true, stock:5, category:"Electrónica", thumbnails:[] }
  ];

  await Product.insertMany(products);
  console.log("Seed completado:", products.length, "productos");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
