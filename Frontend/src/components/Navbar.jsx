import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import { Leaf, Settings, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useDarkMode();

  const token = localStorage.getItem("nutritrack_token");
  const user = JSON.parse(localStorage.getItem("nutritrack_user") || "{}");

  const logout = () => {
    localStorage.removeItem("nutritrack_token");
    localStorage.removeItem("nutritrack_user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* KIRI: Brand + Nav */}
        <div className="flex items-center gap-6">
          <Link
            to={token ? "/dashboard" : "/"}
            className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"
          >
            <Leaf size={18} className="text-emerald-500" strokeWidth={2.5} />
            <span className="text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              NutriTrack
            </span>
          </Link>

          {token && (
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/weight-tracker", label: "Catat Berat badan" },
                { to: "/profile", label: "Profile" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === to
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* KANAN: Controls */}
        <div className="flex items-center gap-2.5">
          {token && user.name && (
            <span className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 mr-1">
              Halo, <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
            </span>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {dark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          </button>

          {token ? (
            <>
              <Link
                to="/profile"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  location.pathname === "/profile"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Settings size={15} strokeWidth={2} />
              </Link>
              <button
                onClick={logout}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 h-9 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {location.pathname !== "/login" && (
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2"
                >
                  Masuk
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link
                  to="/register"
                  className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl font-semibold transition-all shadow-md shadow-emerald-600/10"
                >
                  Daftar
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
