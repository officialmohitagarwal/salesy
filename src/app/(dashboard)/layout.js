"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  Menu,
  PanelLeft,
  PanelRight,
  Package,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({});

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "QR Labels", href: "/labels", icon: Package },
    { name: "History", href: "/history", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  //FETCH PROFILE
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data || {}));
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">

      {/*MOBILE OVERLAY*/}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/*SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50 top-0 left-0
          h-screen flex flex-col
          bg-[#020617] border-r border-white/10
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full w-full">

          {/* SCROLLABLE */}
          <div className="flex-1 overflow-y-auto p-4">

            {/* LOGO */}
            <div className="mb-8">
              {!collapsed ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    S
                  </div>
                  <span className="font-semibold text-white">Salesy</span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    S
                  </div>
                </div>
              )}
            </div>

            {/* NAV */}
            <nav className={`flex flex-col gap-3 ${collapsed ? "items-center" : ""}`}>
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)} // close on click
                    className={`group relative flex items-center ${
                      collapsed
                        ? "justify-center w-12 h-12"
                        : "gap-3 w-full px-3 py-2"
                    } rounded-xl transition ${
                      active
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={20} />
                    {!collapsed && <span>{link.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* USER + LOGOUT */}
          <div className="border-t border-white/10 p-4">

            {!collapsed && session && (
              <div className="mb-3 text-sm text-slate-300">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-xs text-slate-400">
                  {session.user.email}
                </p>
              </div>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`flex items-center ${
                collapsed
                  ? "justify-center w-12 h-12"
                  : "gap-3 w-full px-3 py-2"
              } rounded-xl text-red-400 hover:bg-red-500/10 transition`}
            >
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN  */}
      <div className="flex-1 flex flex-col min-w-0">

        {/*TOPBAR  */}
        <header className="h-14 md:h-16 border-b border-white/10 flex items-center justify-between px-3 md:px-6 bg-[#020617]/60 backdrop-blur-md shrink-0">

          <div className="flex items-center gap-2 md:gap-3">

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden"
            >
              <Menu size={18} />
            </button>

            {/* DESKTOP COLLAPSE */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
            >
              {collapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
            </button>

            {/* TITLE  */}
            <h1 className="text-sm md:text-lg font-semibold truncate max-w-[150px] md:max-w-none">
              {profile.businessName
                ? `${profile.businessName} Dashboard`
                : "Dashboard"}
            </h1>
          </div>

          {/* BUTTON */}
          <Link
            href="/sale"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition text-white text-xs md:text-sm px-3 md:px-5 py-2 rounded-full"
          >
            + New Sale
          </Link>
        </header>

        {/* CONTENT  */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}