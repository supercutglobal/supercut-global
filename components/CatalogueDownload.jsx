"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { GROTESK_FONT } from "./fonts";

const inputClass =
  "w-full border border-neutral-300 rounded-lg px-4 py-3 text-[15px] text-[#0b1526] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0b1f4b] focus:border-transparent";

function CatalogueForm({ onClose }) {
  // Unmounted on close, so the form always reopens empty
  const [values, setValues] = useState({ name: "", email: "", mobile: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined, form: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (values.name.trim().length < 2) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = "Enter a valid email";
    if (!/^\+?[0-9][0-9\s()-]{6,19}$/.test(values.mobile.trim())) next.mobile = "Enter a valid mobile number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const { data } = await axios.post("/api/catalogue", values);
      window.location.href = data.downloadUrl; // served as an attachment, so the page stays put
      setStatus("done");
    } catch (err) {
      const data = err?.response?.data;
      setErrors(data?.fields || { form: data?.error || "Something went wrong, please try again" });
      setStatus("idle");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-title"
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      style={{ fontFamily: GROTESK_FONT }}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 text-xl cursor-pointer"
        >
          ✕
        </button>

        {status === "done" ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#2f9e5b] text-white text-2xl grid place-items-center">✓</div>
            <h2 id="catalogue-title" className="mt-4 text-[22px] font-bold text-[#0b1f4b]">Thank you!</h2>
            <p className="mt-2 text-[15px] text-neutral-600">Your catalogue download has started. Our team may contact you about your requirements.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 bg-[#0b1f4b] text-white font-semibold text-[15px] px-6 py-3 rounded-lg hover:bg-[#13306b] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="catalogue-title" className="text-[22px] sm:text-[24px] font-bold text-[#0b1f4b] pr-8">Download our catalogue</h2>
            <p className="mt-1.5 text-[14.5px] text-neutral-600">Fill in your details and the PDF will download straight away.</p>

            <div className="mt-5 space-y-3">
              {[
                { field: "name", label: "Full name", type: "text", autoComplete: "name" },
                { field: "email", label: "Email", type: "email", autoComplete: "email" },
                { field: "mobile", label: "Mobile number", type: "tel", autoComplete: "tel" },
              ].map(({ field, label, ...rest }) => (
                <div key={field}>
                  <label htmlFor={`catalogue-${field}`} className="block text-[13px] font-semibold text-neutral-700 mb-1">
                    {label} <span className="text-[#d64545]">*</span>
                  </label>
                  <input
                    id={`catalogue-${field}`}
                    value={values[field]}
                    onChange={set(field)}
                    maxLength={field === "mobile" ? 20 : 120}
                    aria-invalid={Boolean(errors[field])}
                    className={inputClass}
                    {...rest}
                  />
                  {errors[field] && <p className="mt-1 text-[13px] text-[#d64545]">{errors[field]}</p>}
                </div>
              ))}

              {/* Honeypot for bots; hidden from people and screen readers */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.company} onChange={set("company")} className="hidden" />
            </div>

            {errors.form && <p role="alert" className="mt-3 text-[14px] text-[#d64545]">{errors.form}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 w-full bg-[#0b1f4b] text-white font-semibold text-[15px] py-3.5 rounded-lg hover:bg-[#13306b] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {status === "sending" ? "Please wait…" : "Download catalogue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/** A button (styled by the caller) that asks for name, email and mobile before the catalogue downloads */
export function CatalogueButton({ children, className, onClick, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          setOpen(true);
          onClick?.(e);
        }}
        className={`${className} cursor-pointer`}
        {...props}
      >
        {children}
      </button>
      {/* Portalled to <body>: the buttons sit inside animated (transformed) containers that would trap a fixed overlay */}
      {open && createPortal(<CatalogueForm onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
