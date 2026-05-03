"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
    businessGST: "",
    businessAddress: "",
    businessPhone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(data.error || "Failed to load profile");
        return;
      }

      setForm({
        name: data.name || "",
        email: data.email || "",
        password: "",
        businessName: data.businessName || "",
        businessType: data.businessType || "",
        businessGST: data.businessGST || "",
        businessAddress: data.businessAddress || "",
        businessPhone: data.businessPhone || "",
      });

      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid server response" };
      }

      if (!res.ok) {
        return alert(data.error || "Update failed");
      }

      alert("Profile updated successfully");

      setForm((prev) => ({
        ...prev,
        password: "",
      }));

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Loading...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-400">
          Manage your account and business details
        </p>
      </div>

      {/* ACCOUNT */}
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold">Account</h3>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            className="input"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            className="input"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="input md:col-span-2"
            placeholder="New Password (leave empty to keep current)"
            value={form.password}
            onChange={handleChange}
          />

        </div>
      </div>

      {/* BUSINESS */}
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold">Business Info</h3>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="businessName"
            className="input"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
          />

          <input
            name="businessType"
            className="input"
            placeholder="Business Type (e.g. Electronics, Clothing)"
            value={form.businessType}
            onChange={handleChange}
          />

          <input
            name="businessGST"
            className="input"
            placeholder="GST Number"
            value={form.businessGST}
            onChange={handleChange}
          />

          <input
            name="businessPhone"
            className="input"
            placeholder="Business Phone Number"
            value={form.businessPhone}
            onChange={handleChange}
          />

          <input
            name="businessAddress"
            className="input md:col-span-2"
            placeholder="Business Address"
            value={form.businessAddress}
            onChange={handleChange}
          />

        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary px-6">
          Save Changes
        </button>
      </div>

    </div>
  );
}