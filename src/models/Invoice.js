import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
  },

  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
  },

  items: [
    {
      item: String,
      productId: mongoose.Schema.Types.ObjectId,
      price: Number,
      quantity: Number,
    },
  ],

  subtotal: Number,
  gst: Number,
  total: {
    type: Number,
    required: true,
  },

  paymentMode: {
    type: String,
    enum: ["cash", "upi", "card", "credit", "bank"],
    default: "cash",
  },

  
  htmlSnapshot: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


InvoiceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
