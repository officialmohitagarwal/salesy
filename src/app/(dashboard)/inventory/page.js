"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { safeFetch } from "@/lib/fetcher";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    id: "",
    date: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "",
    cost: "",
    selling: "",
    quantity: "",
    date: "",
    supplier: "",
  });

  const [stockForm, setStockForm] = useState({
    productId: "",
    quantity: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const data = await safeFetch("/api/products");
    const safe = Array.isArray(data) ? data : [];
    setInventory(safe);
    setFiltered(safe);
    setLoading(false);
  };

  useEffect(() => {
    let temp = [...inventory];

    if (filters.name) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.type) {
      temp = temp.filter((p) =>
        (p.type || "").toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    if (filters.id) {
      temp = temp.filter((p) =>
        p._id.toLowerCase().includes(filters.id.toLowerCase())
      );
    }

    if (filters.date) {
      temp = temp.filter((p) => p.date === filters.date);
    }

    setFiltered(temp);
  }, [filters, inventory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.selling) {
      return alert("Name and Selling price required");
    }

    const res = await safeFetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        cost: Number(form.cost),
        selling: Number(form.selling),
        quantity: Number(form.quantity),
      }),
    });

    if (res.error) return alert(res.error);

    setForm({
      name: "",
      type: "",
      cost: "",
      selling: "",
      quantity: "",
      date: "",
      supplier: "",
    });

    setIsOpen(false);
    fetchInventory();
  };

  const handleStockUpdate = async () => {
    if (!stockForm.productId || !stockForm.quantity) {
      return alert("Select product and quantity");
    }

    const res = await safeFetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: stockForm.productId,
        quantity: Number(stockForm.quantity),
      }),
    });

    if (res.error) return alert(res.error);

    setStockForm({ productId: "", quantity: "" });
    setIsStockOpen(false);
    fetchInventory();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Inventory</h2>
          <p className="text-sm text-slate-400">
            Manage your stock and products
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => setIsOpen(true)} className="btn-primary w-full sm:w-auto">
            + Add Product
          </button>

          <button
            onClick={() => setIsStockOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            + Update Stock
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 grid md:grid-cols-4 gap-3">
        <input name="name" placeholder="Search Name" className="input" value={filters.name} onChange={handleFilterChange}/>
        <input name="type" placeholder="Search Type" className="input" value={filters.type} onChange={handleFilterChange}/>
        <input name="id" placeholder="Search ID" className="input" value={filters.id} onChange={handleFilterChange}/>
        <input type="date" name="date" className="input" value={filters.date} onChange={handleFilterChange}/>
      </div>

      {/* TABLE  */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 text-left whitespace-nowrap">ID</th>
              <th className="p-4 text-left whitespace-nowrap">Product</th>
              <th className="p-4 text-center whitespace-nowrap">Type</th>
              <th className="p-4 text-right whitespace-nowrap">Cost</th>
              <th className="p-4 text-right whitespace-nowrap">Selling</th>
              <th className="p-4 text-center whitespace-nowrap">Stock</th>
              <th className="p-4 text-center whitespace-nowrap">Date</th>
              <th className="p-4 text-center whitespace-nowrap">Supplier</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id} className="border-b border-slate-800 hover:bg-white/5">
                <td className="p-4 whitespace-nowrap">{item._id.slice(-6)}</td>
                <td className="p-4 whitespace-nowrap">{item.name}</td>
                <td className="p-4 text-center whitespace-nowrap">{item.type}</td>
                <td className="p-4 text-right whitespace-nowrap">₹{item.cost}</td>
                <td className="p-4 text-right whitespace-nowrap">₹{item.selling}</td>
                <td className="p-4 text-center whitespace-nowrap">{item.quantity}</td>
                <td className="p-4 text-center whitespace-nowrap">{item.date}</td>
                <td className="p-4 text-center whitespace-nowrap">{item.supplier}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ADD MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-[#020617] p-6 rounded-xl w-full max-w-lg space-y-4">

            <div className="flex justify-between">
              <h3>Add Product</h3>
              <button onClick={() => setIsOpen(false)}><X /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">

              <input name="name" placeholder="Product Name" className="input" value={form.name} onChange={handleChange}/>
              <input name="type" placeholder="Type" className="input" value={form.type} onChange={handleChange}/>
              <input name="cost" type="number" placeholder="Cost Price" className="input" value={form.cost} onChange={handleChange}/>
              <input name="selling" type="number" placeholder="Selling Price" className="input" value={form.selling} onChange={handleChange}/>
              <input name="quantity" type="number" placeholder="Quantity" className="input" value={form.quantity} onChange={handleChange}/>
              <input name="date" type="date" className="input" value={form.date} onChange={handleChange}/>
              <input name="supplier" placeholder="Supplier" className="input md:col-span-2" value={form.supplier} onChange={handleChange}/>

            </div>

            <button onClick={handleAdd} className="btn-primary w-full">
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* STOCK MODAL */}
      {isStockOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-[#020617] p-6 rounded-xl w-full max-w-md space-y-4">

            <div className="flex justify-between">
              <h3>Update Stock</h3>
              <button onClick={() => setIsStockOpen(false)}><X /></button>
            </div>

            <select
              className="input"
              value={stockForm.productId}
              onChange={(e) =>
                setStockForm({ ...stockForm, productId: e.target.value })
              }
            >
              <option value="">Select Product</option>
              {inventory.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              className="input"
              value={stockForm.quantity}
              onChange={(e) =>
                setStockForm({ ...stockForm, quantity: e.target.value })
              }
            />

            <button onClick={handleStockUpdate} className="btn-primary w-full">
              Update Stock
            </button>

          </div>
        </div>
      )}

    </div>
  );
}