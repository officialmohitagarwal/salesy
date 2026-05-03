"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function HistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [profile, setProfile] = useState({});

  const [dateFilter, setDateFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  // FETCH
  useEffect(() => {
    fetchInvoices();
    fetchProfile();
  }, []);

  const fetchInvoices = async () => {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    const safe = Array.isArray(data) ? data : [];

    setInvoices(safe);
    setFiltered(safe);
  };

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data || {});
  };

  // FILTER
  useEffect(() => {
    let temp = [...invoices];

    if (dateFilter) {
      temp = temp.filter((inv) => {
        const d = new Date(inv.createdAt)
          .toISOString()
          .split("T")[0];
        return d === dateFilter;
      });
    }

    if (paymentFilter) {
      temp = temp.filter(
        (inv) => inv.paymentMode === paymentFilter
      );
    }

    setFiltered(temp);
  }, [dateFilter, paymentFilter, invoices]);

  // TOTAL
  const totalSales = filtered.reduce(
    (acc, i) => acc + (Number(i.total) || 0),
    0
  );

  // PDF
  const handleDownload = (inv) => {
    const html = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #111;
          }

          .container {
            max-width: 800px;
            margin: auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .business h2 {
            margin: 0;
          }

          .meta {
            text-align: right;
            font-size: 14px;
          }

          .section {
            margin-top: 20px;
          }

          .bill {
            background: #f9fafb;
            padding: 12px;
            border-radius: 6px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th {
            background: #f3f4f6;
            text-align: left;
            padding: 10px;
            font-size: 14px;
          }

          td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }

          .right {
            text-align: right;
          }

          .total-box {
            margin-top: 20px;
            text-align: right;
          }

          .total {
            font-size: 18px;
            font-weight: bold;
          }

          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #555;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            <div class="business">
              <h2>${profile.businessName || "Your Business"}</h2>
              <p>${profile.businessAddress || ""}</p>
              <p>${profile.businessPhone || ""}</p>
              ${
                profile.businessGST
                  ? `<p><b>GST:</b> ${profile.businessGST}</p>`
                  : ""
              }
            </div>

            <div class="meta">
              <p><b>Invoice:</b> ${inv.invoiceNo || `INV-${inv._id.slice(-5)}`}</p>
              <p><b>Date:</b> ${new Date(inv.createdAt).toLocaleString()}</p>
              <p><b>Payment:</b> ${inv.paymentMode}</p>
            </div>
          </div>

          <!-- CUSTOMER -->
          <div class="section bill">
            <p><b>Bill To:</b></p>
            <p>${inv.customer?.name || "-"}</p>
            <p>${inv.customer?.phone || ""}</p>
          </div>

          <!-- TABLE -->
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="right">Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
              </tr>
            </thead>

            <tbody>
              ${
                inv.items
                  ?.map(
                    (item) => `
                <tr>
                  <td>${item.item}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">₹${item.price}</td>
                  <td class="right">₹${(
                    item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                  )
                  .join("") || ""
              }
            </tbody>
          </table>

          <!-- TOTAL -->
          <div class="total-box">
            <p>Subtotal: ₹${(inv.subtotal || inv.total).toFixed(2)}</p>
            <p>GST: ₹${(inv.gstAmount || 0).toFixed(2)}</p>
            <p class="total">Total: ₹${Number(inv.total).toFixed(2)}</p>
          </div>

          <div class="footer">
            Thank you for your business
          </div>

        </div>
      </body>
    </html>
    `;

    const win = window.open("", "", "width=900,height=700");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Sales History</h2>
        <p className="text-sm text-slate-400">
          Track and manage all your invoices
        </p>
      </div>

      {/* TOTAL */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400 text-sm">Total Sales</p>
        <h2 className="text-2xl font-bold mt-2">
          ₹{totalSales.toFixed(2)}
        </h2>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">

        <input
          type="date"
          className="input w-full sm:w-auto"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <select
          className="input w-full sm:w-auto"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="credit">Credit</option>
          <option value="bank">Bank</option>
        </select>

        <button
          onClick={() => {
            setDateFilter("");
            setPaymentFilter("");
          }}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg w-full sm:w-auto"
        >
          Clear Filters
        </button>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv._id}
            className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Invoice</span>
              <span>{inv.invoiceNo || `INV-${inv._id.slice(-5)}`}</span>
            </div>

            <div className="font-medium">
              {inv.customer?.name || "-"}
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-green-400 font-mono">
                ₹{Number(inv.total).toFixed(2)}
              </span>
              <span className="capitalize">{inv.paymentMode}</span>
            </div>

            <div className="text-xs text-slate-400">
              {new Date(inv.createdAt).toLocaleString()}
            </div>

            <button
              onClick={() => handleDownload(inv)}
              className="w-full mt-2 bg-violet-600 text-white py-2 rounded-lg"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-[#0f172a] border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Payment</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((inv) => (
              <tr
                key={inv._id}
                className="border-b border-slate-800 hover:bg-white/5"
              >
                <td className="p-4 font-medium">
                  {inv.invoiceNo || `INV-${inv._id.slice(-5)}`}
                </td>

                <td className="p-4">
                  {inv.customer?.name || "-"}
                </td>

                <td className="p-4 text-right font-mono">
                  ₹{Number(inv.total).toFixed(2)}
                </td>

                <td className="p-4 text-center capitalize">
                  {inv.paymentMode}
                </td>

                <td className="p-4 text-center">
                  {new Date(inv.createdAt).toLocaleString()}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDownload(inv)}
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-sm"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            No invoices found
          </div>
        )}
      </div>
    </div>
  );
}