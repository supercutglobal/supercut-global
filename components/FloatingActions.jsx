"use client";

import { CatalogueButton } from "./CatalogueDownload";
import { whatsappUrl, INSTAGRAM_URL, FACEBOOK_URL, LINKEDIN_URL } from "../data/contactData";

const enter = (delay) => ({ animation: `sc-float-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` });
const iconClass =
  "w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer block";

export function FloatingActions() {
  return (
    <div
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 select-none pointer-events-auto"
      aria-label="Quick Actions"
    >
      <style>{`
        @keyframes sc-float-enter {
          0% {
            opacity: 0;
            transform: translateY(80px) scale(0.6);
          }
          65% {
            opacity: 1;
            transform: translateY(-8px) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* WhatsApp */}
      <div style={{ animation: "sc-float-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms both" }}>
        <a
          href={whatsappUrl("Hello Super Cut, I would like to inquire about your products.")}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          aria-label="WhatsApp"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.55)] hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer block"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>

      {/* Instagram */}
      <div style={enter(450)}>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Follow us on Instagram"
          aria-label="Instagram"
          className={`${iconClass} shadow-[0_4px_16px_rgba(220,39,67,0.4)] hover:shadow-[0_6px_22px_rgba(220,39,67,0.55)]`}
          style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>

      {/* Facebook */}
      <div style={enter(550)}>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Follow us on Facebook"
          aria-label="Facebook"
          className={`${iconClass} bg-[#1877F2] hover:bg-[#1468d8] shadow-[0_4px_16px_rgba(24,119,242,0.4)] hover:shadow-[0_6px_22px_rgba(24,119,242,0.55)]`}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
          </svg>
        </a>
      </div>

      {/* LinkedIn */}
      <div style={enter(650)}>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Connect with us on LinkedIn"
          aria-label="LinkedIn"
          className={`${iconClass} bg-[#0A66C2] hover:bg-[#0958a8] shadow-[0_4px_16px_rgba(10,102,194,0.4)] hover:shadow-[0_6px_22px_rgba(10,102,194,0.55)]`}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
          </svg>
        </a>
      </div>

      {/* Catalogue PDF */}
      <div style={enter(750)}>
        <CatalogueButton
          title="Download Catalogue PDF"
          aria-label="Catalogue PDF"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white text-[#0b1f4b] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:bg-[#dbe4f3] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer block"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </CatalogueButton>
      </div>
    </div>
  );
}
