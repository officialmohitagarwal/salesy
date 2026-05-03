import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET method
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await Product.find({
      userId: session.user.id,
    });

    return Response.json(products);

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST method 
export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const product = await Product.create({
      ...body,
      userId: session.user.id,
    });

    return Response.json(product);

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return Response.json(
      { error: err.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

// Patch method 
// For updating stock 
export async function PATCH(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();

  
    if (!productId || quantity === undefined) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);

   
    if (isNaN(qty)) {
      return Response.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: productId,
      userId: session.user.id,
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    product.quantity += qty;

    await product.save();

    return Response.json({ success: true });

  } catch (err) {
    console.error("UPDATE STOCK ERROR:", err);
    return Response.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}