import { BookMarked, Plus, Search, CheckSquare } from "lucide-react";

const samplePlaybooks = [
  {
    id: 1,
    name: "Pre-Market Routine",
    category: "Daily Routine",
    steps: 5,
    description: "Steps to follow before the market opens",
  },
  {
    id: 2,
    name: "Trade Entry Checklist",
    category: "Trade Execution",
    steps: 8,
    description: "Checklist before entering any trade",
  },
  {
    id: 3,
    name: "Post-Trade Review",
    category: "Review",
    steps: 6,
    description: "Steps for reviewing trades after market close",
  },
];

export default function PlaybooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trading Playbooks</h1>
          <p className="text-gray-600">Step-by-step guides and checklists for trading</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>New Playbook</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search playbooks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>Daily Routine</option>
          <option>Trade Execution</option>
          <option>Review</option>
          <option>Risk Management</option>
        </select>
      </div>

      {/* Playbooks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {samplePlaybooks.map((playbook) => (
          <div
            key={playbook.id}
            className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {playbook.category}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{playbook.name}</h3>
            <p className="mt-2 text-sm text-gray-500">{playbook.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">{playbook.steps} steps</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Start Checklist
              </button>
            </div>
          </div>
        ))}

        {/* Add new playbook card */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Create Playbook</span>
        </div>
      </div>

      {/* Quick start templates */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Start Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Morning Routine", "Trade Entry", "Trade Exit", "Weekly Review"].map((template) => (
            <button
              key={template}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <BookMarked className="h-5 w-5 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">{template}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
