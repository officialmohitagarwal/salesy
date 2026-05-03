import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      businessName,
      businessType,
      businessAddress,
      businessPhone,
      businessGST,
    } = body;

    // Validation 
    if (!email || !password || !name) {
      return Response.json(
        { error: "Name, Email and Password required" },
        { status: 400 }
      );
    }

    if (!businessName || !businessPhone || !businessAddress) {
      return Response.json(
        { error: "Required business details missing" },
        { status: 400 }
      );
    }

    // Check duplication
    const existing = await User.findOne({ email });

    if (existing) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash 
    const hashed = await bcrypt.hash(password, 10);

    // Create 
    const user = await User.create({
      name,
      email,
      password: hashed,
      businessName,
      businessType,
      businessAddress,
      businessPhone,
      businessGST,
    });

    return Response.json(user);

  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return Response.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}