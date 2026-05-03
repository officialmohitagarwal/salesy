import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  businessName: { type: String, default: "" },
  businessType: { type: String, default: "" },
  businessGST: { type: String, default: "" },
  businessAddress: { type: String, default: "" },
  businessPhone: { type: String, default: "" },
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);