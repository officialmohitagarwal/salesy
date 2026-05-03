import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

//GET method
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await Invoice.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return Response.json(invoices);
  } catch (err) {
    console.error("GET INVOICES ERROR:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

//POST method
export async function POST(req) {
  const sessionDb = await mongoose.startSession();

  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customer, items, subtotal, gst, total, paymentMode, invoiceNo } = body;

    if (!customer?.name || !customer?.phone) {
      return Response.json({ error: "Customer required" }, { status: 400 });
    }

    if (!items?.length) {
      return Response.json({ error: "No items" }, { status: 400 });
    }

    sessionDb.startTransaction();

    //Fetch all products in one query
    const productIds = items.map((i) => i.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      userId: session.user.id,
    });

    const productMap = {};
    products.forEach((p) => (productMap[p._id] = p));

    const processedItems = [];

    for (let item of items) {
      const product = productMap[item.productId];

      if (!product) {
        throw new Error(`${item.item} not found`);
      }

      const qty = Number(item.quantity);

      if (qty > product.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      // deduct
      product.quantity -= qty;
      await product.save({ session: sessionDb });

      processedItems.push({
        item: product.name,
        productId: product._id,
        price: Number(item.price),
        quantity: qty,
      });
    }

    const invoice = await Invoice.create(
      [
        {
          customer,
          items: processedItems,
          subtotal,
          gst,
          total,
          paymentMode: paymentMode || "cash",
          invoiceNo,
          userId: session.user.id,
        },
      ],
      { session: sessionDb }
    );

    await sessionDb.commitTransaction();

    return Response.json(invoice[0]);
  } catch (err) {
    await sessionDb.abortTransaction();
    console.error("CREATE INVOICE ERROR:", err);

    return Response.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  } finally {
    sessionDb.endSession();
  }
}