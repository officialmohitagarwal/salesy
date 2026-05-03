"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessPhone: "",
    businessGST: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Redirect if logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B1220]">
        Loading...
      </div>
    );
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // VALIDATION
    if (
      !form.businessName ||
      !form.businessPhone ||
      !form.businessAddress
    ) {
      setError("Please fill all required business details");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      //Auto login
      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.error) {
        setError("Signup success but login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");

    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-2xl bg-[#111827] p-8 rounded-2xl space-y-6 shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Create your Salesy account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* ACCOUNT  */}
        <div className="space-y-3">
          <h3 className="text-sm text-slate-400">Account Info</h3>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="input"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              className="input"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="input md:col-span-2"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* BUSINESS */}
        <div className="space-y-3">
          <h3 className="text-sm text-slate-400">Business Info</h3>

          <div className="grid md:grid-cols-2 gap-3">

            <input
              type="text"
              placeholder="Business Name *"
              className="input"
              required
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Business Type"
              className="input"
              onChange={(e) =>
                setForm({ ...form, businessType: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number *"
              className="input"
              required
              onChange={(e) =>
                setForm({ ...form, businessPhone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="GST Number"
              className="input"
              onChange={(e) =>
                setForm({ ...form, businessGST: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Business Location / Address *"
              className="input md:col-span-2"
              required
              onChange={(e) =>
                setForm({ ...form, businessAddress: e.target.value })
              }
            />

          </div>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg text-white"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}