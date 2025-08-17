"use client"
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MarketAnalysisChart() {
  const [chartData, setChartData] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true);
      // Fetch ETH price history (last 30 days) from CoinGecko
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
        params: { vs_currency: 'usd', days: 30, interval: 'daily' }
      });
      const prices = res.data.prices;
      const labels = prices.map(p => new Date(p[0]).toLocaleDateString());
      const data = prices.map(p => p[1]);
      setChartData({
        labels,
        datasets: [
          {
            label: 'ETH Price (USD)',
            data,
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            tension: 0.3,
            fill: true,
          }
        ]
      });
      // Simple AI analysis: trend detection
      const trend = data[data.length - 1] > data[0] ? 'upward' : 'downward';
      const percent = (((data[data.length - 1] - data[0]) / data[0]) * 100).toFixed(2);
      setAiSummary(`In the last 30 days, Ethereum price shows a ${trend} trend (${percent}% change).`);
      setLoading(false);
    }
    fetchMarketData();
  }, []);

  if (loading) return <div className="text-center py-4">Loading market analysis...</div>;
  return (
    <div className="w-full p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl mt-6">
      <h3 className="text-sm font-medium text-black dark:text-slate-300 mb-3 flex items-center gap-2">
        Market Analysis (ETH)
      </h3>
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: false }
        },
        scales: {
          y: { beginAtZero: false }
        }
      }} />
      <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
        <strong>AI Insight:</strong> {aiSummary}
      </div>
    </div>
  );
}
