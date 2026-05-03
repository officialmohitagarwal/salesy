import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select("-password");

    return Response.json(user);

  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    return Response.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updateData = {
      name: body.name,
      email: body.email,
      businessName: body.businessName,
      businessType: body.businessType,
      businessGST: body.businessGST,
      businessAddress: body.businessAddress,
      businessPhone: body.businessPhone,
    };

    if (body.password && body.password.length > 5) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true }
    ).select("-password");

    return Response.json(updatedUser);

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}