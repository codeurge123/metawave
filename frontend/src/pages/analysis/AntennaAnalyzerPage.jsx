import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";
import { predictMetamaterial, predictPatchAntenna } from "../../services/api";

function S11Chart({ data }) {
  const width = 320;
  const height = 160;
  const pad = { t: 10, r: 10, b: 30, l: 40 };
  const chartWidth = width - pad.l - pad.r;
  const chartHeight = height - pad.t - pad.b;
  const minS = Math.min(...data.map((point) => point.s11));
  const minF = Number.parseFloat(data[0].f);
  const maxF = Number.parseFloat(data[data.length - 1].f);

  const xScale = (f) => ((Number.parseFloat(f) - minF) / (maxF - minF)) * chartWidth;
  const yScale = (s) => chartHeight - ((s - minS) / (0 - minS)) * chartHeight;

  const pathD = data
    .map((point, index) => `${index === 0 ? "M" : "L"}${pad.l + xScale(point.f)},${pad.t + yScale(point.s11)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="s11grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A5C1E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7A5C1E" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[-10, -20, -30].map((value) => (
        <g key={value}>
          <line
            x1={pad.l}
            x2={pad.l + chartWidth}
            y1={pad.t + yScale(value)}
            y2={pad.t + yScale(value)}
            stroke="#E5DDD0"
            strokeWidth="0.5"
            strokeDasharray={value === -10 ? "3 3" : "2 4"}
          />
          <text x={pad.l - 4} y={pad.t + yScale(value) + 3} textAnchor="end" fontSize="7" fill="#A89880">
            {value}
          </text>
        </g>
      ))}
      <path d={`${pathD} L${pad.l + chartWidth},${pad.t + chartHeight} L${pad.l},${pad.t + chartHeight} Z`} fill="url(#s11grad)" />
      <path d={pathD} fill="none" stroke="#7A5C1E" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function RadiationPattern({ data }) {
  const cx = 90;
  const cy = 90;
  const maxR = 75;
  const pathD =
    data
      .map((point, index) => {
        const r = point.r * maxR;
        const x = cx + r * Math.cos(point.theta - Math.PI / 2);
        const y = cy + r * Math.sin(point.theta - Math.PI / 2);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ") + " Z";

  return (
    <svg viewBox="0 0 180 180" className="mx-auto w-full max-w-[220px]">
      {[0.25, 0.5, 0.75, 1].map((radius) => (
        <circle key={radius} cx={cx} cy={cy} r={radius * maxR} fill="none" stroke="#E5DDD0" strokeWidth="0.6" />
      ))}
      <path d={pathD} fill="rgba(122,92,30,0.12)" stroke="#7A5C1E" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Sidebar({ mode, setMode }) {
  const { isDark } = useTheme();
  const modes = [
    { key: "patch", label: "Patch Antenna", icon: "⊕" },
    { key: "meta", label: "MetaSurface Antenna", icon: "⊞" },
  ];

  return (
    <aside className={`hidden selection:bg-white selection:text-stone-900 h-screen w-72 shrink-0 px-8 py-8 lg:flex lg:flex-col lg:sticky lg:top-0 ${isDark ? "border-r border-stone-800 bg-[#181411]" : "border-r border-stone-200 bg-[#F5F0E8]"}`}>
      <div>
        <div className={`text-[1.7rem] font-bold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>Analyser</div>
        <div className={`mt-3 text-[10px] font-bold leading-5 tracking-[0.25em] ${isDark ? "text-stone-500" : "text-stone-400"}`}>
          TECHNICAL
          <br />
          WORKSPACE
        </div>
      </div>

      <div className="mt-14 space-y-3">
        {modes.map((item) => (
          <button
            key={item.key}
            onClick={() => setMode(item.key)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
              mode === item.key ? "bg-[#E9E1D1] font-semibold text-[#9C7730]" : isDark ? "text-stone-300 hover:bg-stone-900" : "text-stone-600 hover:bg-[#EFE8DB]"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="leading-6">{item.label}</span>
          </button>
        ))}
      </div>

      <div className={`mt-8 rounded-2xl border p-4 text-sm leading-6 ${isDark ? "border-stone-800 bg-stone-900/60 text-stone-400" : "border-stone-200 bg-white/60 text-stone-500"}`}>
        Switch between patch and metasurface studies, then run the solver to generate performance metrics and chart previews.
      </div>

      <div className="mt-auto">
        <Link
          to={APP_ROUTES.home}
          className={`block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${isDark ? "bg-stone-900 text-amber-300 hover:bg-stone-800" : "bg-[#EFE8DB] text-[#7A5C1E] hover:bg-[#E8DDC9]"}`}
        >
          Back to Home
        </Link>
      </div>
    </aside>
  );
}

function ConfigPanel({ params, setParams, onRun, onReset, running, mode }) {
  const fields =
    mode === "patch"
      ? [
          { key: "freq", label: "FREQUENCY (GHz)", min: 0.3, max: 100, step: 0.1 },
          { key: "er", label: "DIELECTRIC CONSTANT", min: 1, max: 20, step: 0.1 },
          { key: "h", label: "SUBSTRATE HEIGHT (mm)", min: 0.1, max: 10, step: 0.1 },
        ]
      : [
          { key: "Wm", label: "Wm:", min: 0, step: 0.01 },
          { key: "W0m", label: "W0m:", min: 0, step: 0.01 },
          { key: "dm", label: "dm:", min: 0, step: 0.01 },
          { key: "tm", label: "tm:", min: 0, step: 0.01 },
          { key: "rows", label: "rows", min: 1, step: 1 },
          { key: "Xa", label: "Xa:", step: 0.01 },
          { key: "Ya", label: "Ya:", step: 0.01 },
        ];

  return (
    <section className="rounded-3xl selection:bg-white selection:text-stone-900 border border-stone-200 bg-[#FDFAF5] p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-lg text-[#7A5C1E]">≡</span>
        <h2 className="font-display text-xl font-bold text-stone-900">Configuration</h2>
      </div>

      <div className={mode === "meta" ? "space-y-3" : "space-y-4"}>
        {fields.map((field) => (
          <label key={field.key} className={mode === "meta" ? "grid grid-cols-[76px,minmax(0,1fr)] items-center gap-3" : "block"}>
            <span className={mode === "meta" ? "text-2xl font-bold leading-none text-stone-800" : "mb-2 block text-[11px] font-semibold tracking-[0.18em] text-stone-400"}>
              {field.label}
            </span>
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={params[field.key]}
              onChange={(event) =>
                setParams((current) => ({ ...current, [field.key]: Number.parseFloat(event.target.value) || 0 }))
              }
              className={mode === "meta" ? "h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-[#7A5C1E]" : "w-full rounded-xl border border-stone-300 bg-[#F5F0E8] px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#7A5C1E]"}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRun}
          disabled={running}
          className="flex-1 rounded-xl bg-[#5C4A1E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4A3B18] disabled:cursor-not-allowed disabled:bg-[#B8A07A]"
        >
          {running ? "Running..." : "Run Analysis"}
        </button>
        <button
          onClick={onReset}
          className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function MetricCard({ label, value, badge, accent = false }) {
  return (
    <div className="rounded-2xl border selection:bg-white selection:text-stone-900 border-stone-200 bg-[#FDFAF5] p-5">
      <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">{label}</div>
      <div className="mt-3 flex items-end gap-3">
        <span className="font-display text-4xl font-black text-stone-900">{value}</span>
        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              accent ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AntennaAnalyzerPage() {
  const { isDark } = useTheme();
  const [mode, setMode] = useState("patch");
  const [params, setParams] = useState({ freq: 2.4, er: 4.4, h: 1.6 });
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [simId, setSimId] = useState("MW-8294-QUARTZ");

  const defaults = {
    patch: { freq: 2.4, er: 4.4, h: 1.6 },
    meta: { Wm: 1, W0m: 1, dm: 1, tm: 1, rows: 4, Xa: 1, Ya: 1 },
  };

  const runAnalysis = useCallback(async () => {
    const requiredKeys = mode === "patch" ? ["freq", "er", "h"] : ["Wm", "W0m", "dm", "tm", "rows", "Xa", "Ya"];
    if (requiredKeys.some((key) => params[key] === "" || Number.isNaN(Number(params[key])))) {
      return;
    }

    setRunning(true);
    setError("");

    try {
      if (mode === "patch") {
        setResults(await predictPatchAntenna(params));
      } else {
        const prediction = await predictMetamaterial(params);
        setResults({
          gain: Number(prediction.gain).toFixed(3),
          S11: Number(prediction.s11).toFixed(3),
          BW: Number(prediction.bandwidth).toFixed(3),
        });
      }
      setRunning(false);
      setSimId(
        `MW-${Math.floor(1000 + Math.random() * 9000)}-${
          ["QUARTZ", "AMBER", "FERRO", "KAPPA"][Math.floor(Math.random() * 4)]
        }`,
      );
    } catch (err) {
      setRunning(false);
      setResults(null);
      setError(err.message || "Prediction failed.");
    }
  }, [mode, params]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setParams(defaults[nextMode]);
    setResults(null);
    setError("");
  };

  const handleReset = () => {
    setParams(defaults[mode]);
    setResults(null);
    setError("");
  };

  const s11Good = results && Number.parseFloat(results.S11) < -10;

  return (
    <div className={`min-h-screen selection:bg-white selection:text-stone-900 ${isDark ? "bg-[#140f0d] text-stone-100" : "bg-[#F5F0E8]"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="flex min-h-screen">
        <Sidebar mode={mode} setMode={handleModeChange} />

        <main className="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 lg:hidden">
              <Link
                to={APP_ROUTES.home}
                className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-medium ${isDark ? "border-stone-700 bg-stone-900 text-stone-200" : "border-stone-300 bg-white text-stone-700"}`}
              >
                Back to Home
              </Link>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "patch", label: "Patch" },
                  { key: "meta", label: "MetaSurface" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleModeChange(item.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      mode === item.key
                        ? "bg-[#E9E1D1] text-[#9C7730]"
                        : isDark ? "border border-stone-700 bg-stone-900 text-stone-300" : "border border-stone-300 bg-white text-stone-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <header className="mb-8">
              <div className="mb-3 inline-flex rounded-full bg-[#EDE4D0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A5C1E]">
                Precision Analysis
              </div>
              <h1 className={`font-display text-4xl font-black tracking-tight md:text-5xl ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                {mode === "patch" ? "Patch Antenna Analyser" : "MetaSurface Analyser"}
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-7 md:text-base ${isDark ? "text-stone-300" : "text-stone-500"}`}>
                {mode === "patch"
                  ? "Configure your study, run a quick calculation, and review key RF metrics with charts laid out for desktop and mobile."
                  : "Enter the metamaterial geometry values and use the trained ML models to predict Gain, S11, and Bandwidth."}
              </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
              <div className="space-y-4">
                <ConfigPanel
                  params={params}
                  setParams={setParams}
                  onRun={runAnalysis}
                  onReset={handleReset}
                  running={running}
                  mode={mode}
                />

                <section className={`rounded-3xl border p-5 text-sm leading-7 shadow-sm ${isDark ? "border-stone-800 bg-stone-900/60 text-stone-300" : "border-stone-200 bg-white/60 text-stone-500"}`}>
                  <div className={`mb-3 text-[11px] font-semibold tracking-[0.18em] ${isDark ? "text-stone-500" : "text-stone-400"}`}>WORKSPACE NOTES</div>
                  {mode === "patch"
                    ? "Patch mode is useful for resonance, bandwidth, and feed matching studies around a single target band."
                    : "Metamaterial mode uses your trained Colab models for direct Gain, S11, and Bandwidth prediction."}
                </section>
              </div>

              <section className="min-w-0">
                <div className={`mb-5 flex flex-col gap-3 rounded-3xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-stone-800 bg-stone-900/60" : "border-stone-200 bg-white/60"}`}>
                  <div>
                    <h2 className={`font-display text-2xl font-bold ${isDark ? "text-stone-100" : "text-stone-900"}`}>Simulation Results</h2>
                    <p className={`mt-1 text-sm ${isDark ? "text-stone-300" : "text-stone-500"}`}>
                      {mode === "patch" ? "Validated performance metrics and quick visual checks." : "ML-predicted outputs for the entered metamaterial antenna inputs."}
                    </p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE4D0] px-4 py-2 text-xs font-bold tracking-[0.14em] text-[#7A5C1E]">
                    <span className={`h-2.5 w-2.5 rounded-full ${running ? "bg-amber-500" : "bg-green-600"}`} />
                    {simId}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {mode === "meta" ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard label="Gain" value={results ? results.gain : "—"} />
                    <MetricCard label="S11 (dB)" value={results ? results.S11 : "—"} badge={results ? (s11Good ? "Optimal" : "Poor") : null} accent={s11Good} />
                    <MetricCard label="Bandwidth" value={results ? results.BW : "—"} />
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MetricCard label="S11 PARAMETER (dB)" value={results ? results.S11 : "—"} badge={results ? (s11Good ? "Optimal" : "Poor") : null} accent={s11Good} />
                    <MetricCard label="MAXIMUM GAIN (dBi)" value={results ? results.gain : "—"} badge={results ? "Peak" : null} />
                    <MetricCard label="BANDWIDTH (%)" value={results ? results.BW : "—"} badge={results ? "3dB" : null} />
                    <MetricCard label="EFFICIENCY (%)" value={results ? results.eff : "—"} badge={results ? "Rad." : null} />
                  </div>
                )}

                {mode === "patch" && results && (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                      {
                        label: mode === "patch" ? "PATCH WIDTH × LENGTH (mm)" : "UNIT CELL PERIOD (mm)",
                        value: mode === "patch" ? `${results.W} × ${results.L}` : results.unitCell_mm,
                      },
                      {
                        label: mode === "patch" ? "RESONANT FREQ (GHz)" : "WAVELENGTH (mm)",
                        value: mode === "patch" ? results.f_r : results.lambda_mm,
                      },
                      { label: "INPUT IMPEDANCE (Ω)", value: results.Zin },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-stone-200 bg-[#FDFAF5] p-5">
                        <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">{item.label}</div>
                        <div className="mt-3 text-xl font-semibold text-stone-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {mode === "patch" && <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
                  <div className="rounded-3xl border border-stone-200 bg-[#FDFAF5] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">REFLECTION COEFFICIENT</div>
                      <span className="text-sm text-stone-300">⛶</span>
                    </div>
                    {results ? (
                      <S11Chart data={results.s11Sweep} />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-sm text-stone-400">
                        {running ? "Computing..." : "Run analysis to see results"}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-[#FDFAF5] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">RADIATION PATTERN</div>
                      <span className="text-sm text-stone-300">⛶</span>
                    </div>
                    {results ? (
                      <RadiationPattern data={results.pattern} />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-stone-400">
                        {running ? "Computing..." : "Run analysis to see results"}
                      </div>
                    )}
                  </div>
                </div>}

                {mode === "patch" && results && (
                  <div className="mt-4 rounded-3xl border border-stone-200 bg-[#FDFAF5] p-5">
                    <div className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-stone-400">PERFORMANCE SUMMARY</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Impedance Match", ok: Number.parseFloat(results.S11) < -10 },
                        { label: "Gain Target (>5 dBi)", ok: Number.parseFloat(results.gain) > 5 },
                        { label: "Bandwidth Adequate", ok: Number.parseFloat(results.BW) > 2 },
                        { label: "High Efficiency", ok: Number.parseFloat(results.eff) > 85 },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`rounded-full px-3 py-2 text-xs font-medium ${
                            item.ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.ok ? "✓" : "⚠"} {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
