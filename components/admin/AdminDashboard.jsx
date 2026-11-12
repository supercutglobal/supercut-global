"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_FONT } from "../fonts";
import { AdminHeader } from "./AdminHeader";
import { ProductForm } from "./ProductForm";
import { toast } from "./toast";

export function AdminDashboard({ adminEmail, productCount }) {
  const [count, setCount] = useState(productCount);

  return (
    <section className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-[#0b1f4b] text-white" style={{ fontFamily: ADMIN_FONT }}>
      <AdminHeader adminEmail={adminEmail} />

      <div className="flex-1 lg:min-h-0 px-4 sm:px-8 py-6 lg:py-5 flex justify-center">
        <div className="w-full max-w-xl bg-[#13306b] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 lg:min-h-0">
          <div className="shrink-0 flex items-baseline justify-between gap-3">
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight">Add product</h1>
            <Link href="/admin/products" className="text-[14px] text-white/70 hover:text-white underline-offset-4 hover:underline">
              {count} products →
            </Link>
          </div>

          <ProductForm
            className="flex-1 lg:min-h-0 min-h-[420px]"
            onSaved={(p) => {
              setCount((c) => c + 1);
              toast.success(`“${p.title}” added to the Products page.`);
            }}
          />
        </div>
      </div>
    </section>
  );
}
