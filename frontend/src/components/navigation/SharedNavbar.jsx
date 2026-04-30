import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { APP_ROUTES, PRIMARY_NAV_ITEMS } from "../../constants/routes";
import { TiWeatherSunny } from "react-icons/ti";
import { TbMoon } from "react-icons/tb";

import { useTheme } from "../../context/ThemeContext";
import { clearSession, getStoredUser, getToken, updatePassword } from "../../services/api";

function ProfileMenu({ isDark, onLogout }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getStoredUser();

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await updatePassword(formData);
      setMessage(response.message);
      setFormData({ current_password: "", new_password: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isDark ? "bg-amber-700 text-white hover:bg-amber-600" : "bg-stone-900 text-white hover:bg-stone-700"
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </span>
        Profile
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-3 w-80 rounded-2xl border p-5 shadow-2xl ${
            isDark ? "border-stone-700 bg-stone-900 text-stone-100" : "border-stone-200 bg-white text-stone-900"
          }`}
        >
          <div className="mb-4 border-b border-stone-200/20 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A67C2E]">User Profile</p>
            <h3 className="mt-2 text-lg font-semibold">{user?.username}</h3>
            <p className={`mt-1 text-sm ${isDark ? "text-stone-400" : "text-stone-500"}`}>{user?.email}</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A67C2E]">Current Password</label>
              <input
                type="password"
                value={formData.current_password}
                onChange={(event) => updateField("current_password", event.target.value)}
                required
                className={`mt-2 w-full rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${
                  isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A67C2E]">New Password</label>
              <input
                type="password"
                value={formData.new_password}
                onChange={(event) => updateField("new_password", event.target.value)}
                required
                minLength="8"
                className={`mt-2 w-full rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-[#7a5c00]/30 ${
                  isDark ? "bg-stone-800 text-stone-100" : "bg-gray-100"
                }`}
              />
            </div>

            {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#7a5c00] py-3 text-sm font-semibold text-white transition hover:bg-[#6a4f00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>

          <button
            onClick={onLogout}
            className={`mt-4 w-full rounded-md border py-3 text-sm font-medium transition ${
              isDark ? "border-stone-700 text-stone-300 hover:bg-stone-800" : "border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function SharedNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const protectedRoutes = new Set([APP_ROUTES.analysis, APP_ROUTES.ai]);

  const handleNavClick = (event, to) => {
    if (!isLoggedIn && protectedRoutes.has(to)) {
      event.preventDefault();
      setMenuOpen(false);
      navigate(APP_ROUTES.signup);
      return;
    }

    setMenuOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-b backdrop-blur ${
        isDark ? "border-stone-800 bg-[#181411]/95" : "border-stone-200 bg-[#F5F0E8]/95"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to={APP_ROUTES.home}
          className={`font-display text-xl font-bold tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}
        >
          MetaWave
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => handleNavClick(event, item.to)}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive
                    ? `border-b-2 border-amber-700 pb-0.5 font-semibold ${isDark ? "text-stone-100" : "text-stone-900"}`
                    : `${isDark ? "text-stone-400 hover:text-stone-200" : "text-stone-500 hover:text-stone-800"}`
                }`
              }
            >
              {item.label.toUpperCase()}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className={`rounded-full cursor-pointer border px-2 py-2 text-sm font-medium transition ${
              isDark
                ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
            }`}
          >
            {isDark ? <TiWeatherSunny /> : <TbMoon />}
          </button>
          {isLoggedIn ? (
            <ProfileMenu isDark={isDark} onLogout={handleLogout} />
          ) : (
            <>
              <Link
                to={APP_ROUTES.login}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isDark
                    ? "border-stone-700 text-stone-200 hover:bg-stone-900"
                    : "border-stone-300 text-stone-700 hover:bg-white"
                }`}
              >
                Login
              </Link>
              <Link
                to={APP_ROUTES.signup}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isDark ? "bg-amber-700 text-white hover:bg-amber-600" : "bg-stone-900 text-white hover:bg-stone-700"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={`rounded-full border px-3 py-2 text-xs font-medium ${
              isDark ? "border-stone-700 bg-stone-900 text-stone-200" : "border-stone-300 bg-white text-stone-700"
            }`}
          >
            {isDark ? "Light" : "Dark"}
          </button>
          <button className={isDark ? "text-stone-100" : "text-stone-900"} onClick={() => setMenuOpen((open) => !open)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={`space-y-3 border-t px-6 py-4 md:hidden ${
            isDark ? "border-stone-800 bg-[#181411]" : "border-stone-200 bg-[#F5F0E8]"
          }`}
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => handleNavClick(event, item.to)}
              className={`block w-full text-left text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-700"}`}
            >
              {item.label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} className={`block text-sm ${isDark ? "text-stone-200" : "text-stone-700"}`}>
              Logout
            </button>
          ) : (
            <>
              <Link to={APP_ROUTES.login} onClick={() => setMenuOpen(false)} className={`block text-sm ${isDark ? "text-stone-200" : "text-stone-700"}`}>
                Login
              </Link>
              <Link to={APP_ROUTES.signup} onClick={() => setMenuOpen(false)} className={`block text-sm ${isDark ? "text-stone-200" : "text-stone-700"}`}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
