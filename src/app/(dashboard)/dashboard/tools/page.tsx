import { Wrench, Plus, Search, ExternalLink } from "lucide-react";

const tradingTools = [
  {
    id: 1,
    name: "Position Size Calculator",
    category: "Risk Management",
    description: "Calculate optimal position size based on risk percentage",
    icon: "calculator",
  },
  {
    id: 2,
    name: "Pip Value Calculator",
    category: "Forex",
    description: "Calculate pip value for different currency pairs",
    icon: "coins",
  },
  {
    id: 3,
    name: "Risk/Reward Calculator",
    category: "Risk Management",
    description: "Calculate and visualize risk to reward ratios",
    icon: "scale",
  },
  {
    id: 4,
    name: "Trading Session Times",
    category: "Market Hours",
    description: "View trading session times across different markets",
    icon: "clock",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trading Tools</h1>
          <p className="text-gray-600">Useful tools and calculators for trading</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tradingTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {tool.category}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{tool.name}</h3>
            <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
            <button className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-700">
              Open Tool
              <ExternalLink className="ml-1 h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Add new tool card */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Add Custom Tool</span>
        </div>
      </div>
    </div>
  );
}
