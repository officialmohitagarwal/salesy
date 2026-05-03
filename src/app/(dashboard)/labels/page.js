"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function LabelsPage() {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({});
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchProfile();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data || {});
  };

  const handleSelect = (id) => {
    const product = products.find((p) => p._id === id);
    setSelected(product);
  };

//   PRINT 
  const handlePrint = () => {
    const content = document.getElementById("print-area").innerHTML;

    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Labels</title>
        </head>
        <body style="font-family: Arial; padding:20px;">
          <div style="
            display:grid;
            grid-template-columns: repeat(2, 1fr);
            gap:16px;
          ">
            ${content}
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">QR Label Generator</h2>
        <p className="text-sm text-slate-400">
          Generate professional product labels
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-4">

        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Choose Product
          </label>
          <select
            className="input"
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (₹{p.selling})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Number of Labels
          </label>
          <input
            type="number"
            min="1"
            className="input"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. New Arrival / Offer / Batch A"
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

      </div>

      {/* LABELS */}
      {selected && (
        <>
          <div
            id="print-area"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  color: "black",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  width: "100%",
                  maxWidth: "260px",
                  flexDirection: "column",
                }}
              >
                {/* TOP CONTENT */}
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>

                  {/* QR */}
                  <QRCodeSVG
                    value={JSON.stringify({
                      productId: selected._id,
                      product: selected.name,
                      price: selected.selling,
                      business: profile.businessName,
                    })}
                    size={80}
                  />

                  {/* RIGHT */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "600", fontSize: "13px" }}>
                      {profile.businessName || "Your Business"}
                    </span>

                    <span style={{ fontSize: "11px", color: "#555" }}>
                      {selected.name}
                    </span>

                    <span style={{ fontWeight: "bold", fontSize: "16px", marginTop: "4px" }}>
                      ₹{selected.selling}
                    </span>

                    <div
                      style={{
                        borderTop: "1px dashed #999",
                        margin: "6px 0",
                      }}
                    />

                    {notes && (
                      <span style={{ fontSize: "10px", color: "#333" }}>
                        {notes}
                      </span>
                    )}
                  </div>
                </div>

                
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "9px",
                    color: "#666",
                    letterSpacing: "0.5px",
                    borderTop: "1px solid #eee",
                    width: "100%",
                    paddingTop: "4px",
                    textAlign: "center",
                  }}
                >
                  ID: {selected._id}
                </div>

              </div>
            ))}
          </div>

          <button onClick={handlePrint} className="btn-primary">
            Download / Print Labels
          </button>
        </>
      )}
    </div>
  );
}