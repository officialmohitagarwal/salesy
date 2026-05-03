import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  location: String,
  since: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);