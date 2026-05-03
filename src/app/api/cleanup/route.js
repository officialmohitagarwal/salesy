import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import Invoice from "@/models/Invoice";

export async function GET() {
  await connectDB();

  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Invoice.deleteMany({});

  return Response.json({ message: "All data cleared" });
}