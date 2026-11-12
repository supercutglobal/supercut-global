"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "./api";

const LINKS = [
  { href: "/admin", label: "Add product" },
  { href: "/admin/products", label: "Products" },
];

export function AdminHeader({ adminEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await api.post("/api/auth/logout").catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="shrink-0 border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/images/supercut_logo_stacked.webp" alt="SUPER CUT" className="h-9 sm:h-10 w-auto bg-white rounded-lg px-2 py-1" />
          <span className="hidden sm:inline font-semibold text-[17px]">Admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`text-[13px] sm:text-[14px] font-semibold px-3 py-2 rounded-lg transition-colors ${
                pathname === l.href ? "bg-white text-[#0b1f4b]" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 text-[13px] sm:text-[14px]">
        <span className="hidden lg:inline text-white/70 truncate max-w-[220px]">{adminEmail}</span>
        <a href="/products" target="_blank" rel="noopener noreferrer" className="border border-white/20 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
          View site
        </a>
        <button type="button" onClick={logout} className="bg-white text-[#0b1f4b] font-semibold px-3 py-2 rounded-lg hover:bg-[#dbe4f3] transition-colors cursor-pointer">
          Log out
        </button>
      </div>
    </header>
  );
}
