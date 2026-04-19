import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { APP_ROUTES, PRIMARY_NAV_ITEMS } from "../../constants/routes";
import { useTheme } from "../../context/ThemeContext";

export default function SharedNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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
            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
              isDark
                ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
            }`}
          >
            {isDark ? "Light" : "Dark"}
          </button>
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
              onClick={() => setMenuOpen(false)}
              className={`block w-full text-left text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-700"}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to={APP_ROUTES.login} onClick={() => setMenuOpen(false)} className={`block text-sm ${isDark ? "text-stone-200" : "text-stone-700"}`}>
            Login
          </Link>
          <Link to={APP_ROUTES.signup} onClick={() => setMenuOpen(false)} className={`block text-sm ${isDark ? "text-stone-200" : "text-stone-700"}`}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
