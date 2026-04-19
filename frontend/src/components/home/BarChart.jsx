const bars = [
  { h: "45%", color: "#D4B896" },
  { h: "62%", color: "#B8A07A" },
  { h: "80%", color: "#5C4A1E" },
  { h: "55%", color: "#C8A96E" },
  { h: "70%", color: "#9E8860" },
];

export default function BarChart() {
  return (
    <div className="relative flex h-90 w-100 rotate-2 hover:scale-105 hover:rotate-3 transition-transform duration-300 flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-4 space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-stone-200" />
        <div className="h-1.5 w-1/2 rounded-full bg-stone-100" />
      </div>
      <div className="absolute top-5 right-5 h-3 w-3 rounded-full bg-amber-400" />
      <div className="flex h-28 items-end gap-2">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-md transition-all duration-700"
            style={{
              height: bar.h,
              backgroundColor: bar.color,
              animationDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {bars.map((_, index) => (
          <div key={index} className="h-0.5 flex-1 rounded-full bg-stone-200" />
        ))}
      </div>
    </div>
  );
}
