"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Prefilled demo credentials
  const [form, setForm] = useState({
    email: "test@demo.com",
    password: "test@123",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Prevent flicker
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Loading...
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-[#111827] p-8 rounded-2xl space-y-5 shadow-xl"
    >
      <h2 className="text-2xl font-semibold text-white text-center">
        Login to Salesy
      </h2>

      {/* Demo Credentials Info */}
      <div className="bg-[#1f2937] border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
        <p className="font-medium text-violet-400 mb-1">
          Demo Credentials
        </p>
        <p>Email: test@demo.com</p>
        <p>Password: test@123</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={form.password} 
        className="w-full p-3 rounded-lg bg-[#1f2937] text-white outline-none"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 transition p-3 rounded-lg text-white"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-gray-400 text-sm text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="text-violet-400 cursor-pointer"
        >
          Signup
        </span>
      </p>
      <p className="text-gray-400 text-sm text-center">
          <span
          onClick={() => router.push("/")}
          className="text-slate-400 hover:text-white cursor-pointer"
           >
            ← Back to Homepage
          </span>
      </p>
    </form>
    
  );
}