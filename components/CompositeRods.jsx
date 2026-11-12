import Reveal from "./Reveal";
import { DISPLAY_FONT } from "./fonts";
import { IMAGES } from "../data/catalogueData";

const FEATURES = [
  { title: "Matrix Integrity", text: "Formulated with high-tensile brazing alloys for optimum chip retention." },
  { title: "High Performance", text: "Made with specially processed, crushed tungsten carbide to ensure consistent strength and quality." },
  { title: "Maximum Durability", text: "Uses sharp, intact carbide particles to resist extreme wear and improve milling efficiency." },
];

export function CompositeRods() {
  return (
    <section className="bg-[#0b1f4b] text-white py-10 lg:py-14">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-20 items-center">
        <div>
          <Reveal>
            <h1
              style={{ fontFamily: DISPLAY_FONT }}
              className="text-[clamp(44px,6.2vw,88px)] font-black uppercase leading-[1.04] tracking-[0.02em]"
            >
              <span className="block text-white">Tungsten Carbide</span>
              <span className="block text-white mt-1.5 sm:mt-3">Composite Rods</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="mt-8 text-[17px] sm:text-[18.5px] leading-[1.65] text-white/80">
              <strong className="font-bold text-white">SUPER CUT</strong> Composite Rods combine high-grade tungsten carbide crushed chips embedded in a tough, high-tensile brazing matrix. Designed for severe wear, milling and cutting operations, these rods deliver maximum abrasion resistance and cutting speed.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="border-l-2 border-white pl-4">
                  <h3 className="font-bold text-white text-[18px] sm:text-[19px] leading-tight">{f.title}</h3>
                  <p className="text-white/75 text-[16px] sm:text-[17px] leading-relaxed mt-1">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="scale">
          <img
            src={IMAGES.rodPodium}
            loading="lazy"
            decoding="async"
            alt="Super Cut tungsten carbide composite rods"
            className="w-full max-w-[340px] mx-auto aspect-[3/5] object-cover rounded-2xl"
          />
        </Reveal>
      </div>
    </section>
  );
}
