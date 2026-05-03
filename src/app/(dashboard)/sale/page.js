"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export default function SalePage() {
  const invoiceRef = useRef();

  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [settings, setSettings] = useState({});
  const [paymentMode, setPaymentMode] = useState("cash");

  const [invoiceMeta, setInvoiceMeta] = useState({
    date: "",
    invoiceNo: "",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gst: 18,
  });

  const [items, setItems] = useState([
    { productId: "", item: "", price: 0, quantity: 1, maxQty: 0 },
  ]);

  
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchProfile();

    const now = new Date();
    setInvoiceMeta({
      date: now.toLocaleDateString(),
      invoiceNo: "INV-" + now.getTime().toString().slice(-5),
    });
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setInventory(Array.isArray(data) ? data : []);
  };

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();

    setSettings({
      businessName: data.businessName,
      address: data.businessAddress,
      phone: data.businessPhone,
      gst: data.businessGST,
    });
  };

  //CUSTOMER
  const handleCustomerSelect = (e) => {
    const c = customers.find((x) => x._id === e.target.value);
    if (c) {
      setForm({
        ...form,
        name: c.name,
        phone: c.phone,
        email: c.email,
      });
    }
  };

  //ITEMS
  const handleItemChange = (index, productId) => {
    const updated = [...items];

    const product = inventory.find((p) => p._id === productId);
    if (!product) return;

    updated[index] = {
      productId,
      item: product.name,
      price: product.selling,
      quantity: 1,
      maxQty: product.quantity,
    };

    setItems(updated);
  };

  const handleQtyChange = (index, value) => {
    const updated = [...items];
    const max = updated[index].maxQty;

    if (value > max) {
      alert(`Only ${max} in stock`);
      return;
    }

    updated[index].quantity = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", item: "", price: 0, quantity: 1, maxQty: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  //CALCULATION
  const subtotal = items.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );

  const gstAmount = (subtotal * form.gst) / 100;
  const total = subtotal + gstAmount;

  //SAVE
  const handleSale = async () => {
    if (!form.name || !form.phone) {
      return alert("Customer required");
    }

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: form,
        items,
        subtotal,
        gst: form.gst,
        total,
        paymentMode,
        invoiceNo: invoiceMeta.invoiceNo,
      }),
    });

    const data = await res.json();

    // if (data.error) return alert(data.error);
    if (data.error) return alert("Error! Please choose atleast one Product");


    alert("Invoice saved!");
  };

  //PRINT
  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;

    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #000;
            }
            h2 { margin-bottom: 5px }
            p { margin: 3px 0 }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              border-bottom: 2px solid #000;
              text-align: left;
              padding: 8px 0;
            }
            td {
              border-bottom: 1px solid #ddd;
              padding: 6px 0;
            }
            .right { text-align: right }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* FORM */}
      <div className="bg-[#0f172a] p-6 rounded-xl space-y-4">

        <h2 className="text-xl font-semibold">Create Invoice</h2>

        <select className="input" onChange={handleCustomerSelect}>
          <option>Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input className="input" placeholder="Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input className="input" placeholder="Phone"
          value={form.phone}
          onChange={(e)=>setForm({...form,phone:e.target.value})}
        />

        <input className="input" placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input type="number" className="input"
          value={form.gst}
          onChange={(e)=>setForm({...form,gst:Number(e.target.value)})}
        />

        <select
          className="input"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="credit">Credit</option>
          <option value="bank">Bank</option>
        </select>

        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">

            <select
              className="input"
              value={it.productId}
              onChange={(e)=>handleItemChange(i, e.target.value)}
            >
              <option value="">Select Item</option>
              {inventory.map((p)=>(
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input className="input" value={it.price} readOnly />

            <input
              className="input"
              value={it.quantity}
              onChange={(e)=>handleQtyChange(i, Number(e.target.value))}
            />

            <button onClick={()=>removeItem(i)}>
              <Trash2 size={18} />
            </button>

          </div>
        ))}

        <button onClick={addItem} className="text-indigo-400">
          + Add Item
        </button>

        <h3 className="text-xl font-semibold">
          ₹{total.toFixed(2)}
        </h3>

        <div className="flex gap-2">
          <button onClick={handleSale} className="btn-primary w-full">
            Save
          </button>
          <button onClick={handlePrint} className="btn-primary w-full">
            Download PDF
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div
        ref={invoiceRef}
        className="bg-white text-black p-10 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold">
          {settings.businessName || "Your Business"}
        </h2>
        <p>{settings.address}</p>
        <p>{settings.phone}</p>
        {settings.gst && <p>GST: {settings.gst}</p>}

        <hr className="my-4"/>

        <p><b>Invoice:</b> {invoiceMeta.invoiceNo}</p>
        <p><b>Date:</b> {invoiceMeta.date}</p>

        <h3 className="mt-4">Bill To:</h3>
        <p>{form.name}</p>
        <p>{form.phone}</p>

        <table className="w-full mt-4">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it,i)=>(
              <tr key={i} className="border-b">
                <td className="py-2">{it.item}</td>
                <td className="text-center">{it.quantity}</td>
                <td className="text-center">₹{it.price}</td>
                <td className="text-right">
                  ₹{(it.price * it.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST ({form.gst}%): ₹{gstAmount.toFixed(2)}</p>
          <h3 className="text-lg font-bold">
            Total: ₹{total.toFixed(2)}
          </h3>
        </div>

        <p className="mt-4">Payment Mode: {paymentMode}</p>
      </div>
    </div>
  );
}
