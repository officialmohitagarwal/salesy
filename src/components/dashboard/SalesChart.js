"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({ invoices = [] }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    last7Days.push({
      date: d.toDateString(),
      name: days[d.getDay()],
      sales: 0,
    });
  }

  invoices.forEach((inv) => {
    if (!inv.createdAt) return;

    const invDate = new Date(inv.createdAt).toDateString();
    const match = last7Days.find((d) => d.date === invDate);

    if (match) {
      match.sales += Number(inv.total) || 0;
    }
  });

  return (
    <div className="card h-[350px] flex flex-col">

      <h3 className="mb-4 text-sm text-slate-500">
        Last 7 Days Sales
      </h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days}>

            <XAxis dataKey="name" />

            <Tooltip
              formatter={(value) => `₹${value}`}
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
              }}
            />

            <Bar
              dataKey="sales"
              fill="#7c3aed"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}