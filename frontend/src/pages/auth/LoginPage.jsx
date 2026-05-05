import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";
import { saveSession, signin } from "../../services/api";

const LoginPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await signin(formData);
      saveSession(response);
      navigate(APP_ROUTES.ai);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDark ? "bg-[#140f0d]" : "bg-[#f5f2ea]"}`}>
      <div className="mb-8 text-center">
        <Link to={APP_ROUTES.home} className="text-3xl font-bold tracking-tight text-[#7a5c00]">
          MetaWave
        </Link>
        <p className={`mt-2 text-xs tracking-[0.2em] ${isDark ? "text-stone-500" : "text-gray-500"}`}>
          PRECISION ANALYZER ACCESS
        </p>
      </div>

      <div className={`w-full max-w-md rounded-2xl p-8 shadow-xl ${isDark ? "bg-stone-900 text-stone-100" : "bg-white"}`}>
        <h2 className="mb-2 text-xl font-semibold">Welcome Back</h2>
        <p className={`mb-6 text-sm ${isDark ? "text-stone-400" : "text-gray-500"}`}>
          Please enter your credentials to proceed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold tracking-widest text-[#7a5c00]">EMAIL ADDRESS</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="name@company.com"
              required
              className={`mt-2 w-full rounded-md p-3 outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-widest text-[#7a5c00]">PASSWORD</label>
              <Link to={APP_ROUTES.signup} className={`cursor-pointer text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>
                FORGOT?
              </Link>
            </div>

            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="••••••••"
              required
              className={`mt-2 w-full rounded-md p-3 outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"}`}
            />
          </div>

          {error && (
            <p className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-red-950/40 text-red-200" : "bg-red-50 text-red-700"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#7a5c00] py-3 font-semibold text-white shadow-md transition hover:bg-[#6a4f00] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Sign In to Analyzer"}
          </button>
        </form>

        {/* <div className="my-6 flex items-center">
          <div className={`h-px flex-1 ${isDark ? "bg-stone-700" : "bg-gray-200"}`}></div>
          <span className={`px-3 text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>OR CONTINUE WITH</span>
          <div className={`h-px flex-1 ${isDark ? "bg-stone-700" : "bg-gray-200"}`}></div>
        </div> */}

        {/* <button className={`flex w-full items-center justify-center gap-3 rounded-md border py-3 transition ${isDark ? "border-stone-700 hover:bg-stone-800" : "hover:bg-gray-50"}`}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Google</span>
        </button> */}

        <p className={`mt-6 text-center text-sm ${isDark ? "text-stone-400" : "text-gray-500"}`}>
          New to the system?{" "}
          <Link to={APP_ROUTES.signup} className="cursor-pointer font-medium text-[#7a5c00]">
            Create an account
          </Link>
        </p>
      </div>

      <div className={`mt-10 space-y-2 text-center text-xs ${isDark ? "text-stone-500" : "text-gray-400"}`}>
        <p>© 2024 METAWAVE SYSTEMS. GOLDEN HOUR PRECISION.</p>
        <div className="flex justify-center gap-6">
          <Link to={APP_ROUTES.home}>PRIVACY</Link>
          <Link to={APP_ROUTES.analysis}>LEGAL</Link>
          <Link to={APP_ROUTES.ai}>SECURITY</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
