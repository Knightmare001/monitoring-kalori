import { Link } from "react-router-dom";
import { Flame, Beef, Activity } from "lucide-react";
import Navbar from "../components/Navbar"; // <-- Import Navbar universal di sini

export default function Home() {
  return (
    // Mengubah bg-slate-950 menjadi adaptif (bg-slate-50 dark:bg-slate-950)
    // agar sinkron saat user pindah ke light mode dari landing page
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      {/* 1. Header / Navigation diganti dengan Navbar universal */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur">
          ✨ Aplikasi Tugas Akhir Penulisan Ilmiah
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100 max-w-3xl leading-[1.15]">
          Pantau Nutrisimu, Raih{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Komposisi Tubuh
          </span>{" "}
          Ideal
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mt-2">
          NutriTrack membantu mencatat makanan harian, menghitung target makronutrisi secara personal, serta memantau
          kalori yang terbakar dari aktivitas olahraga dalam satu dasbor yang terintegrasi dan real-time.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            to="/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold rounded-2xl shadow-xl shadow-emerald-900/20 dark:shadow-emerald-900/40 text-white transition-all transform hover:-translate-y-0.5 text-base"
          >
            Mulai Hitung Kalori Sekarang
          </Link>
        </div>
      </section>

      {/* 3. Metrics/Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 backdrop-blur shadow-sm dark:shadow-none">
          {[
            { number: "100%", label: "Akurat & Personalisasi" },
            { number: "Real-time", label: "Sinkronisasi Data" },
            { number: "Mifflin", label: "Formula Standar BMR" },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-2 border-r last:border-0 border-slate-200 dark:border-slate-800/60">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {item.number}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-medium tracking-wider">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Fitur Utama Penunjang Progres
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Segala hal yang kamu butuhkan untuk tracking defisit atau surplus kalori.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm dark:shadow-none transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Flame size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Kalkulator BMR & TDEE</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Menghitung kebutuhan kalori harianmu secara otomatis menggunakan formula akurat yang disesuaikan dengan
              tinggi badan, berat badan, usia, dan intensitas gerakmu.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm dark:shadow-none transition-all">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Beef size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Pencatatan Makronutrisi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Pantau asupan gizi harianmu secara presisi mulai dari Karbohidrat, Protein, hingga Lemak demi memastikan
              otot mendapatkan nutrisi yang optimal.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm dark:shadow-none transition-all">
            <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 text-sky-500 rounded-xl flex items-center justify-center mb-4">
              <Activity size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Log Olahraga & Beban</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Catat setiap aktivitas olahragamu. Sistem secara dinamis akan menjumlahkan kalori terbakar ke kuota kalori
              harian sehingga target makromu ikut beradaptasi.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
        <div>© 2026 NutriTrack. Dirancang untuk efisiensi monitoring gizi komprehensif.</div>
      </footer>
    </div>
  );
}
