import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const { Schema, model } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] }
});

productSchema.plugin(mongoosePaginate);

export default model("Product", productSchema);