import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, default: 1 }
      }
    ],
    default: []
  }
});

export default model("Cart", cartSchema);