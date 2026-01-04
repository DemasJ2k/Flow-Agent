import { Lightbulb, Plus, Search, Tag } from "lucide-react";

const sampleStrategies = [
  {
    id: 1,
    name: "ICT Order Block Strategy",
    category: "ICT",
    description: "Entry based on order block mitigation with FVG confluence",
  },
  {
    id: 2,
    name: "Scalping Setup",
    category: "Scalping",
    description: "Quick entries on lower timeframes with tight stops",
  },
];

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trading Strategies</h1>
          <p className="text-gray-600">Manage and document your trading strategies</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>New Strategy</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search strategies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>ICT</option>
          <option>Scalping</option>
          <option>Swing Trading</option>
          <option>Day Trading</option>
        </select>
      </div>

      {/* Knowledge base cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">ICT Knowledge Base</h3>
          <p className="text-blue-100 text-sm mb-4">
            Order Blocks, Fair Value Gaps, Liquidity Pools, Market Structure, Killzones
          </p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">
            Explore ICT Concepts
          </button>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Scalping Knowledge Base</h3>
          <p className="text-purple-100 text-sm mb-4">
            Entry techniques, Risk management, Market conditions, Indicators
          </p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">
            Explore Scalping Techniques
          </button>
        </div>
      </div>

      {/* Strategies list */}
      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Your Strategies</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleStrategies.length > 0 ? (
            sampleStrategies.map((strategy) => (
              <div key={strategy.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {strategy.category}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No strategies yet</h3>
              <p className="text-sm mt-2">Create your first trading strategy to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
