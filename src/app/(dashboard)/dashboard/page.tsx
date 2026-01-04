import { auth } from "@/auth";
import { LineChart, MessageSquare, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    name: "AI Chat",
    description: "Chat with AI for trading insights",
    href: "/dashboard/chat",
    icon: MessageSquare,
    color: "bg-blue-500",
  },
  {
    name: "Charts",
    description: "View market charts and analysis",
    href: "/dashboard/charts",
    icon: LineChart,
    color: "bg-green-500",
  },
  {
    name: "Journal",
    description: "Log your trades and thoughts",
    href: "/dashboard/journal",
    icon: BookOpen,
    color: "bg-purple-500",
  },
  {
    name: "Strategies",
    description: "Manage your trading strategies",
    href: "/dashboard/strategies",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your Trading AI dashboard, {session?.user?.name || "Trader"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <div className={`inline-flex rounded-lg ${action.color} p-3`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {action.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="mt-4 text-gray-500 text-center py-8">
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start chatting with AI or add a journal entry</p>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
          <div className="mt-4 text-gray-500 text-center py-8">
            <p>Configure your API keys to see market data</p>
            <Link href="/dashboard/settings" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Go to Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
