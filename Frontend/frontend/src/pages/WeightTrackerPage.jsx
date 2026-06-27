import Navbar from "../components/Navbar";
import WeightTrackerModule from "../components/WeightTrackerModule";

export default function WeightTrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Navbar Global */}
      <Navbar />

      {/* Konten Utama Halaman Weight Tracker */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div className="mb-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Analisis Berat Badan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau perkembangan berat badan harian Anda untuk menjaga konsistensi program gizi.
          </p>
        </div>

        {/* Memanggil modul tracker berat badan */}
        <WeightTrackerModule />
      </main>
    </div>
  );
}
