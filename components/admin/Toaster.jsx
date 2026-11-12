"use client";

import { useEffect, useState } from "react";
import { ADMIN_FONT } from "../fonts";
import { toast, listeners, currentToasts } from "./toast";

const STYLES = {
  success: "border-[#2f9e5b] text-[#0b1526]",
  error: "border-[#d64545] text-[#0b1526]",
  loading: "border-[#9db0d6] text-[#0b1526]",
  confirm: "border-[#d64545] text-[#0b1526]",
};

function Icon({ type }) {
  if (type === "loading") return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[#9db0d6] border-t-[#0b1f4b] animate-spin" />;
  if (type === "error" || type === "confirm") return <span className="h-5 w-5 shrink-0 rounded-full bg-[#d64545] text-white text-[13px] font-bold grid place-items-center">!</span>;
  return <span className="h-5 w-5 shrink-0 rounded-full bg-[#2f9e5b] text-white text-[12px] font-bold grid place-items-center">✓</span>;
}

export function Toaster() {
  const [list, setList] = useState(currentToasts);

  useEffect(() => {
    listeners.add(setList);
    return () => listeners.delete(setList);
  }, []);

  return (
    <div aria-live="polite" className="fixed z-[60] bottom-4 right-4 left-4 sm:left-auto flex flex-col items-end gap-2 pointer-events-none" style={{ fontFamily: ADMIN_FONT }}>
      {list.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" || t.type === "confirm" ? "alert" : "status"}
          className={`pointer-events-auto w-full sm:w-[340px] bg-white border-l-4 ${STYLES[t.type]} rounded-lg shadow-xl px-4 py-3 flex flex-wrap items-center gap-3 text-[14px] animate-[toast-in_180ms_ease-out]`}
        >
          <Icon type={t.type} />
          <p className="flex-1 leading-snug">{t.message}</p>
          {t.type === "confirm" ? (
            <div className="w-full flex justify-end gap-2">
              <button type="button" onClick={t.onCancel} className="text-[13px] font-semibold border border-neutral-300 px-3 py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={t.onConfirm} autoFocus className="text-[13px] font-semibold bg-[#d64545] text-white px-3 py-1.5 rounded-lg hover:bg-[#b93838] cursor-pointer">
                {t.confirmLabel}
              </button>
            </div>
          ) : t.type !== "loading" && (
            <button type="button" onClick={() => toast.dismiss(t.id)} aria-label="Dismiss" className="text-neutral-400 hover:text-neutral-700 text-[18px] leading-none cursor-pointer">
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
