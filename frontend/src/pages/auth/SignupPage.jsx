import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`relative flex min-h-screen items-center justify-center px-4 ${isDark ? "bg-[#140f0d]" : "bg-[#f5f2ea]"}`}>
      <Link to={APP_ROUTES.home} className="absolute top-6 left-10 text-lg font-semibold text-[#7a5c00]">
        MetaWave
      </Link>

      <div className={`w-full max-w-md rounded-2xl p-8 shadow-xl ${isDark ? "bg-stone-900 text-stone-100" : "bg-white"}`}>
        <h1 className="mb-2 text-center text-2xl font-bold">Create Account</h1>
        <p className={`mb-6 text-center text-sm ${isDark ? "text-stone-400" : "text-gray-500"}`}>
          Experience the Aurelian Quartz precision.
        </p>

        <button className={`mb-6 flex w-full items-center justify-center gap-3 rounded-md py-3 transition ${isDark ? "bg-stone-800 hover:bg-stone-700" : "bg-[#e8dfcf] hover:bg-[#ddd3be]"}`}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="google" />
          <span className={`text-sm font-medium ${isDark ? "text-stone-200" : "text-gray-700"}`}>Continue with Google</span>
        </button>

        <div className="mb-6 flex items-center">
          <div className={`h-px flex-1 ${isDark ? "bg-stone-700" : "bg-gray-200"}`}></div>
          <span className={`px-3 text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>OR VIA EMAIL</span>
          <div className={`h-px flex-1 ${isDark ? "bg-stone-700" : "bg-gray-200"}`}></div>
        </div>

        <form className="space-y-5">
          <div>
            <label className="text-xs font-semibold tracking-widest text-[#7a5c00]">USERNAME</label>
            <input
              type="text"
              placeholder="e.g. meta_architect"
              className={`mt-2 w-full rounded-md p-3 outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold tracking-widest text-[#7a5c00]">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="precision@metawave.io"
              className={`mt-2 w-full rounded-md p-3 outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold tracking-widest text-[#7a5c00]">SECURITY KEY</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={`w-full rounded-md p-3 outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"}`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-3 right-3 cursor-pointer ${isDark ? "text-stone-400" : "text-gray-500"}`}
              >
                👁
              </span>
            </div>
            <p className={`mt-2 text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>
              Must contain at least 12 characters including one special metric.
            </p>
          </div>

          <div className={`flex items-start gap-2 text-sm ${isDark ? "text-stone-400" : "text-gray-600"}`}>
            <input type="checkbox" className="mt-1" />
            <p>
              I acknowledge the{" "}
              <Link to={APP_ROUTES.home} className="cursor-pointer font-medium text-[#7a5c00]">
                Terms of Protocol
              </Link>{" "}
              and the{" "}
              <Link to={APP_ROUTES.home} className="cursor-pointer font-medium text-[#7a5c00]">
                Data Privacy Policy
              </Link>
              .
            </p>
          </div>

          <button className="w-full rounded-md bg-gradient-to-r from-[#7a5c00] to-[#c9a227] py-3 font-semibold text-white shadow-md transition hover:opacity-90">
            Initialize Account
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${isDark ? "text-stone-400" : "text-gray-500"}`}>
          Already part of the grid?{" "}
          <Link to={APP_ROUTES.login} className="cursor-pointer font-medium text-[#7a5c00]">
            Sign In
          </Link>
        </p>
      </div>

      <div className={`absolute bottom-6 text-center text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>
        <div className="mb-2 flex justify-center gap-6">
          <Link to={APP_ROUTES.analysis}>API STATUS</Link>
          <Link to={APP_ROUTES.ai}>SECURITY</Link>
          <Link to={APP_ROUTES.login}>CONTACT</Link>
        </div>
        <p>© 2024 METAWAVE SYSTEMS. GOLDEN HOUR PRECISION.</p>
      </div>

      <div className={`absolute right-10 bottom-10 select-none text-[120px] font-bold opacity-20 ${isDark ? "text-stone-700" : "text-gray-200"}`}>
        MW
      </div>
    </div>
  );
};

export default SignupPage;
