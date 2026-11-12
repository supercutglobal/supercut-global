import Reveal from "./Reveal";
import { DISPLAY_FONT } from "./fonts";
import { IMAGES } from "../data/catalogueData";

const FEATURES = [
  { title: "Erosion & Abrasion Defense", text: "Provides a dense surface layer resistant to particle impact and sliding wear." },
  { title: "Low Working Temperature", text: "Deposited at approximately 1050°C, minimizing thermal damage to base metals." },
  { title: "Controlled Fluidity", text: "Superior puddle control during oxyacetylene deposition." },
];

export function HardfacingRope() {
  return (
    <section className="bg-[#0b1f4b] text-white py-10 lg:py-14">
      <style>{`
        @keyframes float-spool {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-spool { animation: float-spool 6s ease-in-out infinite; }
      `}</style>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-20 items-center">
        <div>
          <Reveal>
            <h1 style={{ fontFamily: DISPLAY_FONT }} className="uppercase leading-[0.95] tracking-tight">
              <span className="block text-white text-[clamp(56px,6.5vw,92px)] font-black">Flexible</span>
              <span className="block text-white text-[clamp(28px,3.4vw,44px)] font-black mt-3 sm:mt-4 tracking-normal">Hardfacing Rope (HF-5000)</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="mt-8 text-[17px] sm:text-[18.5px] leading-[1.65] text-white/80">
              <strong className="font-bold text-white">SUPER CUT</strong> Flexible Hardfacing Rope consists of premium cast tungsten carbide, spherical cast tungsten carbide, or a blend of both suspended in a nickel-based self-fluxing binder. Built around a central nickel wire core, this rope enables precise torch deposition on complex geometries.
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

        <Reveal variant="scale" className="lg:order-first">
          <div className="w-full max-w-[340px] mx-auto aspect-[3/5] bg-white rounded-2xl p-6 flex items-center justify-center">
            <img
              src={IMAGES.ropeSpool}
              loading="lazy"
              decoding="async"
              alt="Flexible Hardfacing Rope Spool"
              className="w-full h-auto object-contain animate-float-spool"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
