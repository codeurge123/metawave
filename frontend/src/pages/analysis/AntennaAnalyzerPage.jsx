import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";
import { predictMetamaterial, predictPatchAntenna } from "../../services/api";

function LineChart({ data, valueKey, title, yLabel, stroke = "#2563EB", fill = "rgba(37, 99, 235, 0.12)" }) {
  const width = 520;
  const height = 240;
  const pad = { t: 24, r: 16, b: 42, l: 58 };
  const chartWidth = width - pad.l - pad.r;
  const chartHeight = height - pad.t - pad.b;
  const values = data.map((point) => Number(point[valueKey]));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yMin = Math.floor(Math.min(minValue, 0) / 5) * 5;
  const yMax = Math.ceil(Math.max(maxValue, 0) / 5) * 5 || 5;
  const minF = Number.parseFloat(data[0].f);
  const maxF = Number.parseFloat(data[data.length - 1].f);

  const xScale = (f) => ((Number.parseFloat(f) - minF) / (maxF - minF)) * chartWidth;
  const yScale = (value) => chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  const pathD = data
    .map((point, index) => `${index === 0 ? "M" : "L"}${pad.l + xScale(point.f)},${pad.t + yScale(Number(point[valueKey]))}`)
    .join(" ");
  const gridValues = [yMin, yMin + (yMax - yMin) / 2, yMax];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id={`lineFill-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <text x={width / 2} y="14" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1C1917">
        {title}
      </text>
      {gridValues.map((value) => (
        <g key={value}>
          <line
            x1={pad.l}
            x2={pad.l + chartWidth}
            y1={pad.t + yScale(value)}
            y2={pad.t + yScale(value)}
            stroke="#C8C0B2"
            strokeWidth="0.8"
          />
          <text x={pad.l - 4} y={pad.t + yScale(value) + 3} textAnchor="end" fontSize="7" fill="#A89880">
            {value.toFixed(value % 1 === 0 ? 0 : 1)}
          </text>
        </g>
      ))}
      {[minF, Math.round((minF + maxF) / 2), maxF].map((value) => (
        <g key={value}>
          <line
            x1={pad.l + xScale(value)}
            x2={pad.l + xScale(value)}
            y1={pad.t}
            y2={pad.t + chartHeight}
            stroke="#D9D2C8"
            strokeWidth="0.7"
          />
          <text x={pad.l + xScale(value)} y={height - 15} textAnchor="middle" fontSize="8" fill="#78716C">
            {value}
          </text>
        </g>
      ))}
      <path d={`${pathD} L${pad.l + chartWidth},${pad.t + chartHeight} L${pad.l},${pad.t + chartHeight} Z`} fill={fill} />
      <path d={pathD} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      {data.map((point) => (
        <circle
          key={`${valueKey}-${point.f}`}
          cx={pad.l + xScale(point.f)}
          cy={pad.t + yScale(Number(point[valueKey]))}
          r="3.2"
          fill={stroke}
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      ))}
      <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="9" fill="#57534E">
        Frequency (GHz)
      </text>
      <text x="12" y={height / 2} textAnchor="middle" fontSize="9" fill="#57534E" transform={`rotate(-90 12 ${height / 2})`}>
        {yLabel}
      </text>
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
          { key: "Sub_W", label: "SUBSTRATE WIDTH", min: 0, step: 0.01 },
          { key: "Sub_L", label: "SUBSTRATE LENGTH", min: 0, step: 0.01 },
          { key: "Sub_H", label: "SUBSTRATE HEIGHT", min: 0, step: 0.01 },
          { key: "Patch_W", label: "PATCH WIDTH", min: 0, step: 0.01 },
          { key: "Patch_L", label: "PATCH LENGTH", min: 0, step: 0.01 },
          { key: "Feed_W", label: "FEED WIDTH", min: 0, step: 0.01 },
          { key: "Slot1_W", label: "SLOT1 WIDTH", min: 0, step: 0.01 },
          { key: "Slot1_L", label: "SLOT1 LENGTH", min: 0, step: 0.01 },
          { key: "Slot2_W", label: "SLOT2 WIDTH", min: 0, step: 0.01 },
          { key: "Slot2_L", label: "SLOT2 LENGTH", min: 0, step: 0.01 },
          { key: "Freq_GHz", label: "FREQUENCY", min: 0, step: 0.01 },
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

      <div className={mode === "meta" ? "space-y-3" : mode === "patch" ? "grid gap-3 sm:grid-cols-2" : "space-y-4"}>
        {fields.map((field) => (
          <label key={field.key} className={mode === "meta" ? "grid grid-cols-[76px,minmax(0,1fr)] items-center gap-3" : "block"}>
            <span className={mode === "meta" ? "text-2xl font-bold leading-none text-stone-800" : "mb-2 block text-[10px] font-semibold tracking-[0.12em] text-stone-400"}>
              {field.label} {mode === "patch" ? `(${field.key === "Freq_GHz" ? "GHz" : "mm"})` : ""}
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
  const [params, setParams] = useState({
    Sub_W: 6.5,
    Sub_L: 6.5,
    Sub_H: 1.6,
    Patch_W: 5.4,
    Patch_L: 3.2,
    Feed_W: 0.7,
    Slot1_W: 0.35,
    Slot1_L: 0.85,
    Slot2_W: 0.3,
    Slot2_L: 0.55,
    Freq_GHz: 28,
  });
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [simId, setSimId] = useState("MW-8294-QUARTZ");

  const defaults = {
    patch: {
      Sub_W: 6.5,
      Sub_L: 6.5,
      Sub_H: 1.6,
      Patch_W: 5.4,
      Patch_L: 3.2,
      Feed_W: 0.7,
      Slot1_W: 0.35,
      Slot1_L: 0.85,
      Slot2_W: 0.3,
      Slot2_L: 0.55,
      Freq_GHz: 28,
    },
    meta: { Wm: 1, W0m: 1, dm: 1, tm: 1, rows: 4, Xa: 1, Ya: 1 },
  };

  const runAnalysis = useCallback(async () => {
    const requiredKeys = mode === "patch"
      ? ["Sub_W", "Sub_L", "Sub_H", "Patch_W", "Patch_L", "Feed_W", "Slot1_W", "Slot1_L", "Slot2_W", "Slot2_L", "Freq_GHz"]
      : ["Wm", "W0m", "dm", "tm", "rows", "Xa", "Ya"];
    if (requiredKeys.some((key) => params[key] === "" || Number.isNaN(Number(params[key])))) {
      return;
    }

    setRunning(true);
    setError("");

    try {
      if (mode === "patch") {
        const prediction = await predictPatchAntenna(params);
        setResults({
          ...prediction,
          gain: Number(prediction.gain).toFixed(4),
          S11: Number(prediction.S11).toFixed(4),
        });
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
                    <MetricCard label="PREDICTED GAIN (dBi)" value={results ? results.gain : "—"} badge={results ? "ML" : null} />
                    <MetricCard label="PREDICTED S11 (dB)" value={results ? results.S11 : "—"} badge={results ? (s11Good ? "Matched" : "Review") : null} accent={s11Good} />
                  </div>
                )}

                {mode === "patch" && results && (
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    {[
                      { label: "SUBSTRATE (mm)", value: `${params.Sub_W} × ${params.Sub_L} × ${params.Sub_H}` },
                      { label: "PATCH (mm)", value: `${params.Patch_W} × ${params.Patch_L}` },
                      { label: "SLOTS (mm)", value: `${params.Slot1_W} × ${params.Slot1_L} / ${params.Slot2_W} × ${params.Slot2_L}` },
                      { label: "FREQUENCY (GHz)", value: params.Freq_GHz },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-stone-200 bg-[#FDFAF5] p-5">
                        <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">{item.label}</div>
                        <div className="mt-3 text-xl font-semibold text-stone-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {mode === "patch" && <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-stone-200 bg-[#FDFAF5] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">GAIN FREQUENCY SWEEP</div>
                    </div>
                    {results ? (
                      <LineChart data={results.gainSweep} valueKey="gain" title="Predicted Gain vs Frequency" yLabel="Gain (dBi)" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm text-stone-400">
                        {running ? "Computing..." : "Run analysis to see results"}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-stone-200 bg-[#FDFAF5] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">S11 FREQUENCY SWEEP</div>
                    </div>
                    {results ? (
                      <LineChart
                        data={results.s11Sweep}
                        valueKey="s11"
                        title="Predicted S11 vs Frequency"
                        yLabel="S11 (dB)"
                        stroke="#B45309"
                        fill="rgba(180, 83, 9, 0.12)"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm text-stone-400">
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
                        { label: "S11 below -10 dB", ok: Number.parseFloat(results.S11) < -10 },
                        { label: "Gain Target (>5 dBi)", ok: Number.parseFloat(results.gain) > 5 },
                        { label: "Frequency in sweep range", ok: Number(params.Freq_GHz) >= 1 && Number(params.Freq_GHz) <= 50 },
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
