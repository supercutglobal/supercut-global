"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_FONT } from "../fonts";

const inputClass =
  "w-full bg-[#163672] border border-white/10 text-white placeholder:text-white/45 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-white";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0b1f4b] text-white flex items-center justify-center px-4" style={{ fontFamily: ADMIN_FONT }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#13306b] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="text-center mb-2">
          <img src="/images/supercut_logo_stacked.webp" alt="SUPER CUT" className="h-14 w-auto mx-auto bg-white rounded-lg px-3 py-2" />
          <h1 className="mt-5 text-[26px] font-semibold tracking-tight">Admin login</h1>
        </div>

        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          className={inputClass}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          className={inputClass}
        />

        {error && <p role="alert" className="text-[14px] text-[#ffb4b4]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-[#0b1f4b] font-semibold text-[15px] py-3 rounded-lg hover:bg-[#dbe4f3] disabled:opacity-60 transition-colors cursor-pointer"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
