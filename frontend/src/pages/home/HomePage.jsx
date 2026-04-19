import { Link } from "react-router-dom";
import AnimatedCounter from "../../components/home/AnimatedCounter";
import SharedNavbar from "../../components/navigation/SharedNavbar";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";

const WORKFLOW_STEPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
    title: "Model Selection",
    desc: "Choose between classic Microstrip Patch or advanced MetaSurface unit cells from our curated library.",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
      </svg>
    ),
    title: "Parameter Input",
    desc: "Define frequency bands, substrate properties, and geometric constraints with high-fidelity control.",
    active: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M3 12l4-4 4 4 4-8 4 8" />
        <path d="M3 20h18" />
      </svg>
    ),
    title: "Synthesize",
    desc: "Our MetaWave engine computes optimal dimensions based on rigorous electromagnetic field theory.",
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 3v12" />
      </svg>
    ),
    title: "Export Results",
    desc: "Get S-parameters, radiation patterns, and CAD-ready design files (DXF/GDSII) instantly.",
    active: true,
  },
];

const FEATURES = [
  { label: "Sub-wavelength precision", value: "0.001λ", sub: "Resolution accuracy" },
  { label: "Frequency coverage", value: "1–300 GHz", sub: "Full spectrum support" },
  { label: "Synthesis speed", value: "< 2s", sub: "Per antenna structure" },
  { label: "Export formats", value: "12+", sub: "CAD & simulation ready" },
];

const TESTIMONIALS = [
  {
    quote:
      "MetaWave cut our patch antenna design cycle from weeks to hours. The electromagnetic accuracy is exceptional.",
    name: "Dr. Priya Nair",
    title: "RF Systems Lead, ISRO",
  },
  {
    quote:
      "The MetaSurface synthesis engine is unlike anything available commercially. We've integrated it into our 5G mmWave pipeline.",
    name: "Jonas Ehrhardt",
    title: "Principal Engineer, Ericsson Research",
  },
  {
    quote:
      "From parameter input to DXF export in under 3 seconds. This is what computational EM should look like.",
    name: "Aiko Tanaka",
    title: "Antenna Scientist, NTT Docomo Labs",
  },
];

export default function HomePage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen font-serif ${isDark ? "bg-[#140f0d] text-stone-100" : "bg-[#F5F0E8] text-stone-900"}`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .hero-italic { font-family: 'Playfair Display', serif; font-style: italic; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-0 { animation: fadeUp 0.7s ease both; }
        .anim-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .anim-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.4s ease both; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.10); }
        .btn-primary { transition: background 0.2s, transform 0.15s; }
        .btn-primary:hover { background: #3D2E0A !important; transform: translateX(2px); }
        .btn-secondary:hover { background: #EDE7D9 !important; }
      `}</style>

      <SharedNavbar />

      <section
        className={`flex min-h-screen items-center pt-24 pb-16 ${
          isDark ? "bg-[linear-gradient(160deg,#140f0d_60%,#221914_100%)]" : "bg-[linear-gradient(160deg,#F5F0E8_60%,#EDE4D0_100%)]"
        }`}
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="flex flex-col gap-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className={`anim-0 mb-6 inline-block rounded-full px-3 py-1.5 text-xs font-semibold tracking-widest uppercase ${isDark ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-800"}`}>
                Precision Engineering
              </div>
              <h1 className={`anim-1 font-display mb-6 text-4xl leading-[1.05] font-black sm:text-5xl md:text-6xl lg:text-7xl ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                The Future of{" "}
                <span className="hero-italic" style={{ color: "#7A5C1E" }}>
                  Antenna
                  <br />
                  Design
                </span>
              </h1>
              <p className={`anim-2 mx-auto mb-10 max-w-2xl text-base leading-relaxed sm:text-lg ${isDark ? "text-stone-300" : "text-stone-600"}`}>
                Synthesizing high-precision structures for next-generation Patch and MetaSurfaces with computational elegance.
              </p>
              <div className="anim-3 flex flex-col items-stretch justify-center gap-4 sm:flex-row">
                <Link
                  to={APP_ROUTES.analysis}
                  className="btn-primary flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
                  style={{ background: "#5C4A1E" }}
                >
                  Start Analysis
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to={APP_ROUTES.ai}
                  className={`btn-secondary rounded-full border px-6 py-3.5 text-sm font-semibold backdrop-blur-sm ${isDark ? "border-stone-700 bg-stone-900/40 text-stone-100" : "border-stone-300 bg-white/50 text-stone-700"}`}
                >
                  Explore MetaWave AI
                </Link>
              </div>
              {/* <div className={`anim-4 mt-12 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3 ${isDark ? "border-stone-800" : "border-stone-200"}`}>
                {[["500+", "Antennas Synthesized"], ["89.2%", "EM Accuracy"]].map(
                  ([value, label]) => (
                    <div key={label}>
                      <div className={`font-display text-2xl font-bold ${isDark ? "text-stone-100" : "text-stone-900"}`}>{value}</div>
                      <div className={`mt-0.5 text-xs ${isDark ? "text-stone-400" : "text-stone-500"}`}>{label}</div>
                    </div>
                  ),
                )}
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${isDark ? "bg-[#1b1512]" : "bg-[#EDEAE0]"}`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">Process</span>
            <h2 className={`font-display mt-3 mb-3 text-4xl font-black md:text-5xl ${isDark ? "text-stone-100" : "text-stone-900"}`}>Precision Workflow</h2>
            <p className={`max-w-md text-lg ${isDark ? "text-stone-400" : "text-stone-500"}`}>The delicate science of electromagnetic synthesis, simplified.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <div
                key={index}
                className={`card-hover flex flex-col gap-4 rounded-2xl p-6 ${
                  step.active ? "bg-stone-800 text-white shadow-xl" : isDark ? "bg-stone-900 text-stone-100 shadow-sm" : "bg-stone-100 text-stone-800 shadow-sm"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    step.active ? "bg-amber-400 text-stone-900" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {step.icon}
                </div>
                <div className={`text-xs font-bold tracking-widest ${step.active ? "text-amber-300" : "text-stone-400"}`}>
                  0{index + 1}
                </div>
                <h3 className={`font-display text-lg font-bold ${step.active ? "text-white" : "text-stone-800"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${step.active ? "text-stone-300" : "text-stone-500"}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className={`overflow-hidden py-20 text-white sm:py-24 ${isDark ? "bg-stone-950" : "bg-stone-900"}`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1">
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Technology</span>
              <h2 className="font-display mt-4 mb-6 text-4xl leading-tight font-black md:text-5xl">
                Electromagnetic synthesis at its <span className="hero-italic text-amber-400">purest</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-stone-300">
                MetaWave&apos;s engine leverages full-wave computational methods to deliver antennas that perform exactly as specified before fabrication.
              </p>
              <ul className="space-y-3">
                {[
                  "Full-wave EM solver integration",
                  "Substrate & stackup libraries",
                  "Radiation pattern visualization",
                  "S-parameter & VSWR analysis",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-700">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              {[
                { label: "Patch Antenna", icon: "⊕", bg: "#3D2E0A" },
                { label: "MetaSurface", icon: "⊞", bg: "#5C4A1E" },
                { label: "Frequency Sweep", icon: "∿", bg: "#7A5C1E" },
                { label: "Beam Steering", icon: "◈", bg: "#3D2E0A" },
              ].map((item, index) => (
                <div
                  key={index}
                  to={index < 2 ? APP_ROUTES.analysis : APP_ROUTES.ai}
                  className="card-hover flex flex-col gap-3 rounded-2xl p-6"
                  style={{ background: item.bg }}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-stone-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${isDark ? "bg-[#1b1512]" : "bg-[#EDEAE0]"}`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className={`font-display mt-3 text-4xl font-black md:text-5xl ${isDark ? "text-stone-100" : "text-stone-900"}`}>Trusted by RF Engineers</h2>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" style={{ background: "linear-gradient(135deg, #5C4A1E, #3D2E0A)" }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">Get Started</span>
          <h2 className="font-display mt-4 mb-6 text-4xl font-black text-white md:text-6xl">
            Start synthesizing <span className="hero-italic text-amber-300">today</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-stone-300">
            Join the researchers and engineers accelerating their antenna design pipeline with MetaWave.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={APP_ROUTES.signup}
              className="btn-primary flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-stone-900 transition hover:bg-amber-300"
            >
              Start Free Trial
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to={APP_ROUTES.analysis}
              className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Analyzer
            </Link>
          </div>
        </div>
      </section>

      <footer className={`py-12 ${isDark ? "bg-black text-stone-500" : "bg-stone-950 text-stone-400"}`}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div>
            <span className="font-display text-lg font-bold text-white">MetaWave</span>
            <p className="mt-1 text-xs text-stone-500">Electromagnetic synthesis platform</p>
          </div>
          
          <div className="text-xs text-stone-600">© 2026 MetaWave. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
