import { BookOpen, Plus, Search } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trading Journal</h1>
          <p className="text-gray-600">Log your trades and track your progress</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search journal entries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Tags</option>
          <option>Trade Analysis</option>
          <option>Market Notes</option>
          <option>Strategy Review</option>
        </select>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Empty state */}
      <div className="rounded-lg bg-white p-12 shadow-md">
        <div className="text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No journal entries yet</h3>
          <p className="text-sm mt-2 max-w-md mx-auto">
            Start documenting your trades, market observations, and trading thoughts to improve your performance.
          </p>
          <button className="mt-4 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            <span>Create First Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
