import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"; // <-- Pastikan untuk mengimpor komponen Landing Page baru ini
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WeightTrackerPage from "./pages/WeightTrackerPage";

// Guard: redirect ke /login jika belum ada token (Halaman Internal)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("nutritrack_token");
  return token ? children : <Navigate to="/login" replace />;
}

// Guard: redirect ke /dashboard jika sudah login (Halaman Publik/Autentikasi)
function PublicRoute({ children }) {
  const token = localStorage.getItem("nutritrack_token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Utama (/): Menampilkan Landing Page produk.
          Dibungkus PublicRoute agar jika user sudah login, otomatis langsung dilempar ke /dashboard.
        */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* Halaman Autentikasi */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Halaman Aplikasi Internal (Terproteksi) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/weight-tracker"
          element={
            <PrivateRoute>
              <WeightTrackerPage />
            </PrivateRoute>
          }
        />

        {/* Fallback jika rute acak/tidak ditemukan: balikkan ke /dashboard (yang nanti di-guard ke login jika belum auth) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
