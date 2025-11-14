// scripts/seed.js
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
//require('dotenv').config();

async function seed() {
  await mongoose.connect("mongodb+srv://francoaallemandi_db_user:e86iweUzTx6WujPa@cluster0.ag8e0nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  await Cart.deleteMany({});

  const carts = [
    { product: "68db0e4a66af2293374ecf4f", quantity:1},
    { product: "68db0e4a66af2293374ecf4d", quantity:2}
    ]
  await Cart.insertMany(carts);
  console.log("Seed completado:", carts.length, "carritos");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });