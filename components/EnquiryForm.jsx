"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { GROTESK_FONT } from "./fonts";

const inputClass =
  "w-full border border-neutral-300 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-[16px] sm:text-[15px] text-[#0b1526] placeholder:text-neutral-400 placeholder:text-[14px] sm:placeholder:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0b1f4b] focus:border-transparent";

const FIELDS = [
  { field: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", autoComplete: "name", maxLength: 80 },
  { field: "companyName", label: "Company Name", placeholder: "Enter your company name", type: "text", autoComplete: "organization", maxLength: 120 },
  { field: "email", label: "Business Email", placeholder: "name@company.com", type: "email", autoComplete: "email", maxLength: 200 },
  { field: "phone", label: "Phone / WhatsApp Number", placeholder: "+91 98765 43210", type: "tel", autoComplete: "tel", maxLength: 20 },
  { field: "country", label: "Country", placeholder: "Enter your country", type: "text", autoComplete: "country-name", maxLength: 80 },
];

const EMPTY = { name: "", companyName: "", email: "", phone: "", country: "", message: "", company: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name";
  if (v.companyName.trim().length < 2) e.companyName = "Enter your company name";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!/^\+?[0-9][0-9\s()-]{6,19}$/.test(v.phone.trim())) e.phone = "Enter a valid phone number with country code";
  if (v.country.trim().length < 2) e.country = "Enter your country";
  if (v.message.trim().length < 5) e.message = "Tell us what you need";
  return e;
}

function EnquiryForm({ onClose }) {
  // Unmounted on close, so the form always reopens empty
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Lock page scroll behind the dialog
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined, form: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      await axios.post("/api/enquiry", values);
      setStatus("done");
    } catch (err) {
      const data = err?.response?.data;
      setErrors(data?.fields || { form: data?.error || "Something went wrong, please try again" });
      setStatus("idle");
    }
  };

  const label = (htmlFor, text) => (
    <label htmlFor={htmlFor} className="block text-[13px] sm:text-[14px] font-semibold text-neutral-600 mb-1.5">
      {text} <span className="text-neutral-700">*</span>
    </label>
  );
  const error = (field) => errors[field] && <p className="mt-1 px-2 text-[13px] text-[#d64545]">{errors[field]}</p>;

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 grid place-items-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 text-xl cursor-pointer"
    >
      ✕
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-6"
      style={{ fontFamily: GROTESK_FONT }}
    >
      {/* Bottom sheet on mobile, centred two-column dialog on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl max-h-[96dvh] sm:max-h-[90dvh] flex flex-col bg-[#fafafa] rounded-t-2xl sm:rounded-2xl shadow-2xl text-left overflow-hidden"
      >
        {status === "done" ? (
          <div className="text-center px-6 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 sm:py-12">
            {closeButton}
            <div className="mx-auto w-12 h-12 rounded-full bg-[#2f9e5b] text-white text-2xl grid place-items-center">✓</div>
            <h2 id="enquiry-title" className="mt-4 text-[22px] font-bold text-[#0b1f4b]">Thank you!</h2>
            <p className="mt-2 text-[15px] text-neutral-600 max-w-sm mx-auto">Your enquiry has been sent to our sales team. We will get back to you shortly.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full sm:w-auto bg-[#0b1f4b] text-white font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-[#13306b] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col min-h-0">
            {/* Header stays put while the fields scroll */}
            <div className="relative shrink-0 px-5 pt-4 pb-3 sm:px-8 sm:pt-7 sm:pb-4 border-b border-neutral-200">
              <div aria-hidden="true" className="sm:hidden mx-auto -mt-1.5 mb-2.5 h-1 w-10 rounded-full bg-neutral-300" />
              {closeButton}
              <h2 id="enquiry-title" className="text-[19px] sm:text-[24px] font-bold text-[#0b1f4b] pr-10 leading-tight">Request a quote</h2>
              <p className="mt-1 text-[13px] sm:text-[14.5px] leading-snug text-neutral-600 pr-6">Tell us what you need and our sales team will reply by email.</p>
            </div>

            <div className="thin-scroll [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-400 flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pt-4 pb-5 sm:px-8 sm:py-6">
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#0b1526]">1. Contact Information</h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-3.5">
                {FIELDS.map(({ field, label: text, ...rest }, i) => (
                  // An odd last field spans both columns on desktop
                  <div key={field} className={i === FIELDS.length - 1 && FIELDS.length % 2 ? "sm:col-span-2" : undefined}>
                    {label(`enquiry-${field}`, text)}
                    <input
                      id={`enquiry-${field}`}
                      value={values[field]}
                      onChange={set(field)}
                      aria-invalid={Boolean(errors[field])}
                      className={inputClass}
                      {...rest}
                    />
                    {error(field)}
                  </div>
                ))}
              </div>

              <h3 className="mt-5 sm:mt-6 text-[16px] sm:text-[18px] font-bold text-[#0b1526]">2. Your Requirement</h3>
              <div className="mt-3">
                {label("enquiry-message", "Message")}
                <textarea
                  id="enquiry-message"
                  value={values.message}
                  onChange={set("message")}
                  rows={3}
                  maxLength={3000}
                  placeholder="Products, quantities, sizes or any other details"
                  aria-invalid={Boolean(errors.message)}
                  className="w-full min-h-[96px] sm:min-h-[120px] border border-neutral-300 rounded-2xl px-4 sm:px-5 py-3 text-[16px] sm:text-[15px] text-[#0b1526] placeholder:text-neutral-400 placeholder:text-[14px] sm:placeholder:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0b1f4b] focus:border-transparent resize-y"
                />
                {error("message")}
              </div>

              {/* Honeypot for bots; hidden from people and screen readers */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.company} onChange={set("company")} className="hidden" />
            </div>

            {/* Footer stays visible so the submit button is always reachable */}
            <div className="shrink-0 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-5 bg-white shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.12)] sm:shadow-none sm:bg-transparent border-t border-neutral-200">
              {errors.form && <p role="alert" className="mb-2 text-[14px] text-[#d64545]">{errors.form}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#0b1f4b] text-white font-semibold text-[15px] py-3 sm:py-3.5 rounded-full hover:bg-[#13306b] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/** A button (styled by the caller) that opens the quote / enquiry form; the details are emailed to sales */
export function EnquiryButton({ children, className, onClick, ...props }) {
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
      {open && createPortal(<EnquiryForm onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
