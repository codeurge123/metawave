import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SharedNavbar from "../../components/navigation/SharedNavbar";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";

const SUGGESTED_PROMPTS = [
  "Compare FR4 vs Rogers 4350B",
  "Explain this S11 curve",
  "Suggest a beam-steering setup",
  "Optimize for 5.8 GHz Wi-Fi",
];

const RESPONSES = [
  "The Rogers substrate will usually reduce dielectric loading, so resonance tends to shift upward unless you lengthen the radiator slightly.",
  "If the match is poor, try adjusting feed position first. That usually gives a faster improvement than changing the whole geometry.",
  "For better gain, keep element spacing close to half wavelength and make sure the substrate loss tangent stays low.",
  "When bandwidth is the issue, substrate height and dielectric constant usually matter more than small dimensional tweaks.",
];

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A67C2E] text-2xl font-semibold text-white shadow-[0_14px_30px_rgba(166,124,46,0.18)]">
        M
      </div>
      <h2 className="mt-6 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
        How can I help you?
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-500 md:text-base">
        Ask about antenna tuning, substrates, gain optimization, S11 interpretation, or next steps for your design.
      </p>
    </div>
  );
}

function AssistantMessage({ children, meta }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A67C2E] text-sm font-semibold text-white shadow-sm">
        AI
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-[28px] rounded-tl-md border border-stone-200 bg-white px-5 py-4 text-sm leading-8 text-stone-700 shadow-[0_12px_26px_rgba(0,0,0,0.04)]">
          {children}
        </div>
        <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
          {meta}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ children, meta }) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-3xl">
        <div className="rounded-[28px] rounded-br-md bg-[#A67C2E] px-5 py-4 text-sm leading-8 text-white shadow-[0_16px_34px_rgba(166,124,46,0.22)]">
          {children}
        </div>
        <div className="mt-3 text-right text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
          {meta}
        </div>
      </div>
    </div>
  );
}

export default function MetaWaveAIPage() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text.trim();

    if (!content) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        content,
      },
    ]);
    setInputValue("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: RESPONSES[Math.floor(Math.random() * RESPONSES.length)],
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#140f0d] text-stone-100" : "bg-[#F6F1E8]"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
      `}</style>

      <SharedNavbar />

      <main className="px-4 pt-24 pb-8 md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col">
          <section className={`mb-6 rounded-[32px] border px-6 py-8 shadow-[0_20px_60px_rgba(60,40,10,0.06)] md:px-10 md:py-10 ${isDark ? "border-stone-800 bg-[#1d1713]" : "border-stone-200 bg-[#FBF8F2]"}`}>
            <div className="max-w-4xl">
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A67C2E] ${isDark ? "bg-stone-900 ring-1 ring-stone-700" : "bg-white ring-1 ring-stone-200"}`}>
                <span className="h-2.5 w-2.5 rounded-full bg-[#A67C2E]" />
                AI Synthesis Active
              </div>
              <h1 className={`text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05] ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                Antenna Intelligence:{" "}
                <span className="font-display italic text-[#A67C2E]">MetaWave AI</span>
              </h1>
              <p className={`mt-5 max-w-3xl text-base leading-8 md:text-[1.05rem] ${isDark ? "text-stone-300" : "text-stone-600"}`}>
                Explore design questions, substrate changes, tuning strategies, and quick interpretation of electromagnetic results in one focused workspace.
              </p>
            </div>
          </section>

          <section className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border shadow-[0_20px_60px_rgba(60,40,10,0.06)] ${isDark ? "border-stone-800 bg-[#1d1713]" : "border-stone-200 bg-[#FBF8F2]"}`}>
            <div className={`flex items-center justify-between border-b px-6 py-5 md:px-8 ${isDark ? "border-stone-800" : "border-stone-200"}`}>
              <div className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                <span className="h-3 w-3 rounded-full bg-[#A67C2E]" />
                MetaWave Session
              </div>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                #MW-SESSION-882
              </div>
            </div>

            <div className={`min-h-0 flex-1 overflow-y-auto border-b px-5 py-6 md:px-8 md:py-8 ${isDark ? "border-stone-800" : "border-stone-200"}`}>
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="mx-auto max-w-5xl space-y-8">
                  {messages.map((message, index) =>
                    message.role === "assistant" ? (
                      <AssistantMessage key={message.id} meta={`MetaWave AI • ${index === messages.length - 1 ? "Just now" : "1 min ago"}`}>
                        {message.content}
                      </AssistantMessage>
                    ) : (
                      <UserMessage key={message.id} meta="You • just now">
                        {message.content}
                      </UserMessage>
                    ),
                  )}

                  {isTyping && (
                    <AssistantMessage meta="MetaWave AI • typing">
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-stone-400" />
                        <span
                          className="h-2.5 w-2.5 animate-bounce rounded-full bg-stone-400"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="h-2.5 w-2.5 animate-bounce rounded-full bg-stone-400"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </AssistantMessage>
                  )}

                  <div ref={endRef} />
                </div>
              )}
            </div>

            <div className="px-5 py-5 md:px-8 md:py-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${isDark ? "border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800" : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className={`flex flex-col gap-3 rounded-[28px] border px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center ${isDark ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"}`}>
                <button className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${isDark ? "bg-stone-800 text-stone-400" : "bg-stone-100 text-stone-500"}`}>
                  +
                </button>

                <textarea
                  rows="1"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(inputValue);
                    }
                  }}
                  className={`min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none ${isDark ? "text-stone-100 placeholder-stone-500" : "text-stone-700 placeholder-stone-400"}`}
                  placeholder="Message MetaWave AI..."
                />

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    to={APP_ROUTES.analysis}
                    className={`hidden rounded-full border px-4 py-3 text-sm font-medium transition sm:inline-flex ${isDark ? "border-stone-700 text-stone-300 hover:bg-stone-800" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                  >
                    Analysis
                  </Link>
                  <button
                    onClick={() => sendMessage(inputValue)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A67C2E] text-xl text-white transition hover:bg-[#8E671F]"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <p className={`mt-5 text-center text-[11px] font-medium uppercase tracking-[0.2em] ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                Verification required • AI-generated guidance should be cross-checked with full-wave simulations.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
