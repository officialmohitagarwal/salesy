import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET method
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await Customer.find({
      userId: session.user.id,
    });

    return Response.json(customers);
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST method 
export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.phone) {
      return Response.json(
        { error: "Name and Phone required" },
        { status: 400 }
      );
    }

    // duplication checking
    const existing = await Customer.findOne({
      phone: body.phone,
      userId: session.user.id,
    });

    if (existing) {
      return Response.json(
        { error: "Customer with this phone already exists" },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      ...body,
      userId: session.user.id,
    });

    return Response.json(customer);
  } catch (err) {
    return Response.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

// DELETE method 
export async function DELETE(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    await Customer.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

// PATCH method 
export async function PATCH(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await req.json();

    const updated = await Customer.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      data,
      { new: true }
    );

    return Response.json(updated);
  } catch (err) {
    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}