// Contact page data — global office locations

export const OFFICES = [
  {
    id: "usa",
    tag: "Super Cut – USA",
    city: "Benbrook, Texas",
    addr: "9463 Hwy 377 Benbrook, TX 76126, Texas.",
    left: "18.0%",
    top: "41.0%",
    delay: "0s",
  },
  {
    id: "uk",
    tag: "Super Cut – UK",
    city: "Luton, London",
    addr: "19 Arthur street Luton, LU1 3SF, London",
    left: "44.0%",
    top: "26.0%",
    delay: "0.7s",
  },
  {
    id: "mena",
    tag: "Super Cut – MENA",
    city: "Abu Dhabi, UAE",
    addr: "PO Box : 778323, Abu Dhabi United Arab Emirates",
    left: "66.0%",
    top: "42.0%",
    delay: "1.4s",
  },
];

// Sales email and office telephone, shown in the hero and the Contact section
export const SALES_EMAIL = "sales@supercutglobal.com";
export const PHONE = { label: "+971 2 687 8921", tel: "+97126878921" };

// WhatsApp chat number (+971 54 284 7496), digits only as wa.me expects
export const WHATSAPP_NUMBER = "971542847496";
export const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Social profiles, shown as floating icons under WhatsApp
export const INSTAGRAM_URL = "https://www.instagram.com/supercutglobal/";
export const FACEBOOK_URL = "https://www.facebook.com/share/1CpBVwHzqg/";
export const LINKEDIN_URL = "https://www.linkedin.com/in/supercut-hardface-solutions-a2650644a";

// Hostinger webmail sign-in for the team's @supercutglobal.com mailboxes (navbar "Login")
export const WEBMAIL_URL = "https://mail.hostinger.com/";
