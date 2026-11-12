"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ADMIN_FONT } from "../fonts";
import { AdminHeader } from "./AdminHeader";
import { api, uploadImage, readError } from "./api";
import { toast } from "./toast";
import { cldUrl } from "../../lib/cloudinaryUrl";

// Edit popup (and its form) is only downloaded when Edit is first clicked
const EditModal = dynamic(() => import("./EditModal"), { ssr: false });

const PAGE_SIZE = 8;


export function ProductsManager({ adminEmail, initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  // Products with a save or delete still running in the background
  const [pending, setPending] = useState(() => new Set());

  const shown = products.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  // Clamped, so deleting the last product on a page falls back to the page before it
  const currentPage = Math.min(page, pageCount);
  const pageItems = shown.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (n) => {
    setPage(n);
    listRef.current?.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  const markPending = (id, on) =>
    setPending((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const failed = (err, toastId) => {
    const { message, fields, expired } = readError(err);
    if (expired) return router.replace("/admin/login");
    toast.error(fields ? Object.values(fields)[0] || message : message, { id: toastId });
  };

  // Removed from the grid straight away; put back where it was if the server refuses
  const handleDelete = async (product) => {
    if (!(await toast.confirm(`Delete “${product.title}”? Its image is removed from Cloudinary too.`, { confirmLabel: "Delete" }))) return;
    const index = products.findIndex((p) => p._id === product._id);
    setProducts((list) => list.filter((p) => p._id !== product._id));
    const toastId = toast.loading(`Deleting “${product.title}”…`);
    try {
      await api.delete(`/api/admin/products/${product._id}`);
      toast.success(`“${product.title}” deleted.`, { id: toastId });
    } catch (err) {
      setProducts((list) => [...list.slice(0, index), product, ...list.slice(index)]);
      failed(err, toastId);
    }
  };

  // Card shows the new name, description and image at once; the upload and save finish in the background
  const handleEdit = async (original, { title, description, file }) => {
    setEditing(null);
    const previewUrl = file ? URL.createObjectURL(file) : null;
    const replace = (next) => setProducts((list) => list.map((p) => (p._id === original._id ? next : p)));
    replace({ ...original, title: title.trim(), description: description.trim(), ...(previewUrl && { imageUrl: previewUrl }) });
    markPending(original._id, true);
    const toastId = toast.loading(file ? `Uploading image for “${title.trim()}”…` : `Saving “${title.trim()}”…`);
    try {
      const body = { title, description };
      if (file) body.imagePublicId = await uploadImage(file, (pct) => toast.loading(`Uploading image… ${pct}%`, { id: toastId }));
      const { data } = await api.patch(`/api/admin/products/${original._id}`, body);
      replace(data.product);
      toast.success(`“${data.product.title}” saved.`, { id: toastId });
    } catch (err) {
      replace(original);
      failed(err, toastId);
    } finally {
      markPending(original._id, false);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <section className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-[#0b1f4b] text-white" style={{ fontFamily: ADMIN_FONT }}>
      <AdminHeader adminEmail={adminEmail} />

      <div className="flex-1 lg:min-h-0 px-4 sm:px-8 lg:px-12 py-6 lg:py-8 flex flex-col">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight">
            Products <span className="text-white/50 font-normal">({products.length})</span>
          </h1>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full sm:w-72 bg-[#163672] border border-white/10 text-white placeholder:text-white/45 rounded-lg px-4 py-2.5 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {shown.length === 0 ? (
          <p className="text-white/60">{products.length ? "No products match your search." : "No products yet."}</p>
        ) : (
          <ul ref={listRef} data-lenis-prevent className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto thin-scroll lg:-mr-12 lg:pr-[45px] lg:pb-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,220px)] sm:justify-between auto-rows-max gap-3 sm:gap-4 content-start">
            {pageItems.map((p) => (
              <li key={p._id} aria-busy={pending.has(p._id)} className={`h-[300px] bg-[#f4f4f4] text-[#111] rounded-xl overflow-hidden flex flex-col transition-opacity ${pending.has(p._id) ? "opacity-60" : ""}`}>
                <div className="relative h-[140px] shrink-0 bg-[#e4e4e4] overflow-hidden">
                  <img src={cldUrl(p.imageUrl, 500)} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-3 mix-blend-multiply" />
                </div>
                <div className="p-3 flex-1 min-h-0 flex flex-col">
                  <p className="font-semibold uppercase text-[14px] leading-snug line-clamp-2">{p.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-neutral-600 line-clamp-2">{p.description}</p>
                  <div className="mt-auto pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      disabled={pending.has(p._id)}
                      className="flex-1 text-[13px] font-semibold bg-[#0b1f4b] text-white px-3 py-1.5 rounded-lg hover:bg-[#13306b] transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      disabled={pending.has(p._id)}
                      className="flex-1 text-[13px] font-semibold border border-[#0b1f4b] text-[#0b1f4b] px-3 py-1.5 rounded-lg hover:bg-[#0b1f4b] hover:text-white transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav aria-label="Products pagination" className="shrink-0 pt-4 flex items-center justify-center gap-2">
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page" className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white hover:border-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`w-9 h-9 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer ${n === currentPage ? "bg-white text-[#0b1f4b]" : "border border-white/15 text-white hover:border-white hover:bg-white/10"}`}
              >
                {n}
              </button>
            ))}
            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="Next page" className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-white hover:border-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </nav>
        )}
      </div>

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSubmit={(values) => handleEdit(editing, values)}
        />
      )}
    </section>
  );
}
