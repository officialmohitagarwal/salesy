import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: String,
    cost: Number,
    selling: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    date: String,
    supplier: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);