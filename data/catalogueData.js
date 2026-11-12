// Central catalogue data
// Images are served from Cloudinary (uploaded to the supercut/site and supercut/products folders)

import { cldImage } from "../lib/cloudinaryUrl";

export const IMAGES = {
  collage: cldImage("supercut/site/inserts-collage", 1400),
  rodPodium: cldImage("supercut/products/composite-rod", 1000),
  ropeSpool: cldImage("supercut/products/hf-5000-flexible-rope", 1000),
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];
