"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentChart from "@/components/dashboard/PaymentChart";
import SalesChart from "@/components/dashboard/SalesChart";

export default function DashboardPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH 
  const fetchData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/customers"),
      ]);

      const invData = await invRes.json();
      const custData = await custRes.json();

      setInvoices(Array.isArray(invData) ? invData : []);
      setCustomers(Array.isArray(custData) ? custData : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setInvoices([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CALCULATIONS 
  const totalSales = invoices.reduce(
    (acc, i) => acc + (Number(i.total) || 0),
    0
  );

  const totalInvoices = invoices.length;

  const totalCustomers = customers.length;

  //LOADING
  if (loading) {
    return (
      <div className="text-center mt-10 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-slate-400">
          Overview of your business performance
        </p>
      </div>

      {/* STATS  */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="card">
          <p className="text-sm text-slate-400">Total Sales</p>
          <h2 className="text-xl font-semibold mt-1">
            ₹{totalSales.toFixed(2)}
          </h2>
        </div>

        <div className="card">
          <p className="text-sm text-slate-400">Invoices</p>
          <h2 className="text-xl font-semibold mt-1">
            {totalInvoices}
          </h2>
        </div>

        {/* CUSTOMERS CARD */}
        <div className="card">
          <p className="text-sm text-slate-400">Total Customers</p>
          <h2 className="text-xl font-semibold mt-1">
            {totalCustomers}
          </h2>
        </div>

      </div>

      {/*CHARTS*/}
      {invoices.length === 0 ? (
        <div className="card text-center text-slate-400 py-10">
          No sales data yet
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <SalesChart invoices={invoices} />
          <PaymentChart invoices={invoices} />
        </div>
      )}

      {/*QUICK ACTIONS*/}
      <div className="card space-y-4">

        <h3 className="text-lg font-semibold">Quick Actions</h3>

        <div className="grid md:grid-cols-3 gap-3">

          <button
            onClick={() => router.push("/sale")}
            className="bg-violet-600 hover:bg-violet-700 transition text-white py-3 rounded-lg"
          >
            + New Sale
          </button>

          <button
            onClick={() => router.push("/customers")}
            className="bg-violet-600 hover:bg-violet-700 transition text-white py-3 rounded-lg"
          >
            + Add Customer
          </button>

          <button
            onClick={() => router.push("/inventory")}
            className="bg-violet-600 hover:bg-violet-700 transition text-white py-3 rounded-lg"
          >
            + Add Product
          </button>

        </div>

      </div>

    </div>
  );
}