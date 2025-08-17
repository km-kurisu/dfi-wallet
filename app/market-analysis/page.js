import MarketAnalysisChart from "../../components/MarketAnalysisChart";

export default function MarketAnalysisPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-guard">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 mt-12">
        <div className="p-4 sm:p-6 rounded-2xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-slate-100 text-center">Market Analysis</h2>
          <MarketAnalysisChart />
        </div>
      </div>
  </main>
  );
}
