"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
  });

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("Name and Phone are required");
      return;
    }

    const method = editingId ? "PATCH" : "POST";

    const res = await fetch("/api/customers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: editingId,
        since: new Date().toISOString().split("T")[0],
      }),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (data.error) {
      alert(data.error);
      return;
    }

    setForm({ name: "", phone: "", email: "", location: "" });
    setEditingId(null);
    setIsOpen(false);
    fetchCustomers();
  };

  //DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;

    await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchCustomers();
  };

  //EDIT
  const handleEdit = (c) => {
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email,
      location: c.location,
    });
    setEditingId(c._id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Customers</h2>
          <p className="text-sm text-slate-400">Manage all your customers</p>
        </div>

        <button
          onClick={() => {
            setForm({ name: "", phone: "", email: "", location: "" });
            setEditingId(null);
            setIsOpen(true);
          }}
          className="btn-primary"
        >
          + Add Customer
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Location</th>
              <th className="p-4">Since</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c._id}
                className="border-b border-slate-800 hover:bg-white/5"
              >
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.location}</td>
                <td className="p-4">{c.since}</td>

                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-2 py-1 text-xs bg-blue-600 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-2 py-1 text-xs bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#020617] border border-slate-800 p-6 rounded-xl w-full max-w-md space-y-4">

            <div className="flex justify-between">
              <h3>{editingId ? "Edit Customer" : "Add Customer"}</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <input name="name" className="input" placeholder="Name" value={form.name} onChange={handleChange}/>
            <input name="phone" className="input" placeholder="Phone" value={form.phone} onChange={handleChange}/>
            <input name="email" className="input" placeholder="Email" value={form.email} onChange={handleChange}/>
            <input name="location" className="input" placeholder="Location" value={form.location} onChange={handleChange}/>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>

              <button onClick={handleSubmit} className="btn-primary">
                {editingId ? "Update" : "Add"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
