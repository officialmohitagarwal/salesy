"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9"];

export default function PaymentChart({ invoices = [] }) {
  const paymentMap = {};

  invoices.forEach((inv) => {
    const mode = (inv.paymentMode || "unknown").toLowerCase();
    const amount = Number(inv.total) || 0;

    if (!paymentMap[mode]) paymentMap[mode] = 0;
    paymentMap[mode] += amount;
  });

  const data = Object.entries(paymentMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="card h-[350px] flex flex-col">

      <h3 className="mb-4 text-sm text-slate-400">
        Payment Modes
      </h3>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 items-center justify-between gap-4 overflow-hidden">

        {/* CHART */}
        <div className="w-[180px] h-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `₹${value}`}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND (SCROLL SAFE) */}
        <div className="flex-1 overflow-y-auto pr-2 max-h-[200px] space-y-2">

          {data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                {/* TEXT fixed (prevents overflow) */}
                <span className="capitalize text-slate-300 truncate">
                  {entry.name}
                </span>
              </div>

              <span className="text-slate-200 shrink-0">
                ₹{entry.value}
              </span>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}