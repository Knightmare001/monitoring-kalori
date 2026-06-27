import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useDarkMode();

  // Cek status login
  const token = localStorage.getItem("nutritrack_token");
  const user = JSON.parse(localStorage.getItem("nutritrack_user") || "{}");

  const logout = () => {
    localStorage.removeItem("nutritrack_token");
    localStorage.removeItem("nutritrack_user");
    navigate("/login");
  };

  const scrollToWeight = (e) => {
    e.preventDefault();
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
      setTimeout(() => {
        document.getElementById("weight-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById("weight-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* KIRI: Brand & Menu Links */}
        <div className="flex items-center gap-6">
          <Link
            to={token ? "/dashboard" : "/"}
            className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"
          >
            <span className="text-xl">🥗</span>
            <span className="text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              NutriTrack
            </span>
          </Link>

          {/* Navigasi Tengah: Hanya muncul kalau SUDAH LOGIN */}
          {token && (
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                Dasbor
              </Link>
              <Link
                to="/weight-tracker"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === "/weight-tracker"
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                Timbangan Berat
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === "/profile"
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                Profil Saya
              </Link>
            </nav>
          )}
        </div>

        {/* KANAN: Dark Mode & Auth Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Greeting: Hanya jika sudah login */}
          {token && user.name && (
            <span className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 mr-1">
              Halo, <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
            </span>
          )}

          {/* Toggle Dark Mode universal */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent dark:border-slate-800"
          >
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-5.66l-.71.71M6.34 17.66l-.71.71m12.73 0l-.71-.71M6.34 6.34l-.71-.71M12 6a6 6 0 100 12A6 6 0 0012 6z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Kondisi Tombol Berdasarkan Status Login */}
          {token ? (
            <>
              <Link
                to="/profile"
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors ${
                  location.pathname === "/profile"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                ⚙️
              </Link>
              <button
                onClick={logout}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 h-9 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            // Tampilan Tombol Jika Berada di Halaman Publik & Belum Login
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
