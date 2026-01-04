import { LineChart, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const marketCategories = [
  { name: "Forex", pairs: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"] },
  { name: "Crypto", pairs: ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD"] },
  { name: "Metals", pairs: ["XAU/USD", "XAG/USD"] },
  { name: "Stocks", pairs: ["AAPL", "TSLA", "NVDA", "MSFT"] },
];

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Market Charts</h1>
        <p className="text-gray-600">Real-time market data with ICT pattern detection</p>
      </div>

      {/* Chart placeholder */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>EUR/USD</option>
              <option>GBP/USD</option>
              <option>BTC/USD</option>
              <option>XAU/USD</option>
            </select>
            <div className="flex space-x-1">
              {["1m", "5m", "15m", "1H", "4H", "1D"].map((tf) => (
                <button
                  key={tf}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">ICT Patterns:</span>
            <label className="flex items-center space-x-1 text-sm">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>OB</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>FVG</span>
            </label>
          </div>
        </div>

        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center text-gray-500">
            <LineChart className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Chart Area</h3>
            <p className="text-sm mt-2">Configure Polygon API key in Settings to view charts</p>
            <Link href="/dashboard/settings" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Go to Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Market categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketCategories.map((category) => (
          <div key={category.name} className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
            <div className="space-y-2">
              {category.pairs.map((pair) => (
                <div
                  key={pair}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm font-medium">{pair}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">--</span>
                    <TrendingUp className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
