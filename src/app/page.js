"use client";

import Link from "next/link";
import {
  Package,
  FileText,
  BarChart3,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-[#020617] via-[#020617] to-[#0b0f2a] text-white min-h-screen">

      {/* Navbar  */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-xl font-bold text-violet-400 tracking-wide">
          Salesy
        </h1>

        <div className="flex gap-6 items-center">
          <a href="#features" className="text-sm text-slate-300 hover:text-white">
            Features
          </a>
          <a href="#tech" className="text-sm text-slate-300 hover:text-white">
            Tech
          </a>

          <Link href="/login">
            <button className="bg-violet-600 px-4 py-2 rounded-lg text-sm hover:bg-violet-700 transition">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero  */}
      <section className="text-center py-24 px-6 relative">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2),transparent_60%)]"></div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight relative z-10">
          Run Your Business <br />
          <span className="text-violet-400">Smarter & Faster</span>
        </h1>

        <p className="mt-6 text-slate-400 max-w-xl mx-auto relative z-10">
          Manage inventory, track sales, and generate invoices — all from one powerful platform.
        </p>

        <Link href="/login">
          <button className="mt-8 bg-violet-600 px-8 py-3 rounded-xl text-lg hover:bg-violet-700 transition shadow-lg shadow-violet-900/40 relative z-10">
            Let’s Get Started
          </button>
        </Link>
      </section>

      {/* Features  */}
      <section id="features" className="px-6 md:px-10 py-20">
        <h2 className="text-3xl font-semibold text-center mb-14">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            { icon: Package, title: "Inventory", desc: "Track and manage stock efficiently." },
            { icon: FileText, title: "Invoices", desc: "Generate professional invoices instantly." },
            { icon: BarChart3, title: "Analytics", desc: "Visual insights into your business." },
            { icon: Users, title: "Customers", desc: "Manage and organize customer data." },
            { icon: Zap, title: "Automation", desc: "Auto stock updates with every sale." },
            { icon: Shield, title: "Security", desc: "Secure authentication & protected data." },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition hover:scale-[1.03]"
            >
              <f.icon className="text-violet-400 mb-4" size={28} />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Tech */}
      <section id="tech" className="px-6 md:px-10 py-20">
        <h2 className="text-3xl font-semibold text-center mb-14">
          Built With Modern Stack
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-violet-400 font-semibold">Frontend</h3>
            <p className="text-sm text-slate-400 mt-2">
              Next.js (App Router), React, Tailwind CSS
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-violet-400 font-semibold">Backend</h3>
            <p className="text-sm text-slate-400 mt-2">
              Next.js API Routes (Node.js Runtime), MongoDB
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-violet-400 font-semibold">Auth</h3>
            <p className="text-sm text-slate-400 mt-2">
              NextAuth.js (Secure Session Handling)
            </p>
          </div>

        </div>
      </section>

      {/* Cta */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-semibold">
          Ready to simplify your business?
        </h2>

        <Link href="/login">
          <button className="mt-6 bg-violet-600 px-8 py-3 rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-900/40">
            Start Now
          </button>
        </Link>
      </section>

      {/* Footer  */}
      <footer className="border-t border-white/10 mt-16 px-6 md:px-10 py-10 text-sm text-slate-400">

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-semibold mb-2">Salesy</h3>
            <p>
              A modern business management platform to simplify sales,
              inventory, and analytics.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Product</h3>
            <ul className="space-y-1">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#tech" className="hover:text-white">Tech Stack</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Access</h3>
            <ul className="space-y-1">
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

        </div>

        <div className="text-center mt-10 text-slate-500">
          © {new Date().getFullYear()} Salesy. Built with Next.js.
        </div>

      </footer>
    </div>
  );
}