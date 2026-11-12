import { cldImage } from "../lib/cloudinaryUrl";

// Inserts page data

export const PAGES = [
  {
    pageNumber: "03",
    items: [
      {
        id: "square-inserts",
        title: ["SQUARE", "INSERTS"],
        image: cldImage("supercut/products/square-inserts", 900),
        alt: "Square Inserts",
        desc: "SC006 — 3/8 high-precision square profile for milling & stabilizer dressing.",
      },
      {
        id: "composite-rod",
        title: ["TUNGSTEN CARBIDE", "COMPOSITE ROD"],
        image: cldImage("supercut/products/composite-rod", 900),
        alt: "Tungsten Carbide Composite Rod",
        desc: "Flux-coated composite rod with crushed carbide for severe wear.",
      },
      {
        id: "star-cut-inserts",
        title: ["STAR CUT", "INSERTS"],
        image: cldImage("supercut/products/star-cut-inserts", 900),
        alt: "Star Cut Inserts",
        desc: "SC007–SC010 star geometry — aggressive cutting, high chip evacuation.",
      },
    ],
  },
  {
    pageNumber: "04",
    items: [
      {
        id: "chip-breaker",
        title: ["SC CHIP", "BREAKER"],
        image: cldImage("supercut/products/chip-breaker", 900),
        alt: "SC Chip Breaker",
        desc: "Ribbed breaker top for controlled chip formation in milling tools.",
      },
      {
        id: "tricorn-inserts",
        title: ["SC TRICORN", "INSERTS"],
        image: cldImage("supercut/products/tricorn-inserts", 900),
        alt: "SC Tricorn Inserts",
        desc: "Triangular insert with concave face — fishing & hole-opener duty.",
      },
      {
        id: "round-tapered",
        title: ["ROUND TAPERED", "INSERTS"],
        image: cldImage("supercut/products/round-tapered", 900),
        alt: "Round Tapered Inserts",
        desc: "SC001 round tapered — reamers, casing cutters & coring tools.",
      },
    ],
  },
  {
    pageNumber: "05",
    items: [
      {
        id: "octacut-inserts",
        title: ["SC OCTACUT", "INSERTS"],
        image: cldImage("supercut/products/octacut-inserts", 900),
        alt: "SC Octacut Inserts",
        desc: "SC004 / SC005 octagon tapered — 8-point wear edge for stabilizers.",
      },
      {
        id: "rectangular-tapered",
        title: ["RECTANGULAR", "TAPERED INSERT"],
        image: cldImage("supercut/products/rectangular-tapered", 900),
        alt: "Rectangular Tapered Insert",
        desc: "SC014 / SC015 brick pattern — screw feeders & sand mixers.",
      },
      {
        id: "pdc-inserts",
        title: ["PDC", "INSERTS"],
        image: cldImage("supercut/products/pdc-inserts", 900),
        alt: "PDC Inserts",
        desc: "PDC cutters with premium diamond table for drilling performance.",
      },
    ],
  },
];
