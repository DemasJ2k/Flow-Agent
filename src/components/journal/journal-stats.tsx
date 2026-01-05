"use client";

import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Flame,
  BarChart2,
} from "lucide-react";
import type { JournalStats } from "@/types/journal";

interface JournalStatsProps {
  stats: JournalStats | null;
  isLoading?: boolean;
}

export function JournalStatsPanel({ stats, isLoading }: JournalStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const winRate = stats.trading.winRate;
  const totalPnl = stats.trading.totalPnl;
  const profitFactor = stats.trading.profitFactor;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Total Entries</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Target className="h-4 w-4" />
            <span className="text-sm">Win Rate</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              winRate >= 50 ? "text-green-600" : "text-red-600"
            }`}
          >
            {winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Total P&L</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              totalPnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      {stats.trading.totalTrades > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Trading Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Trades</div>
              <div className="text-xl font-bold">{stats.trading.totalTrades}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Wins</div>
              <div className="text-xl font-bold text-green-600">
                {stats.trading.outcomeBreakdown.win || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Losses</div>
              <div className="text-xl font-bold text-red-600">
                {stats.trading.outcomeBreakdown.loss || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Win</div>
              <div className="text-xl font-bold text-green-600">
                +${stats.trading.avgWin.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Loss</div>
              <div className="text-xl font-bold text-red-600">
                -${stats.trading.avgLoss.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Profit Factor */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Profit Factor</span>
              <span
                className={`text-lg font-bold ${
                  profitFactor >= 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {profitFactor.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  profitFactor >= 1 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.min(profitFactor * 50, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Entry Type & Mood Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entry Types */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Entry Types</h3>
          <div className="space-y-2">
            {Object.entries(stats.entryTypeBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(count / stats.totalEntries) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Mood Distribution</h3>
          <div className="space-y-2">
            {Object.entries(stats.moodBreakdown).map(([mood, count]) => {
              const moodColors: Record<string, string> = {
                positive: "bg-green-500",
                neutral: "bg-yellow-500",
                negative: "bg-red-500",
              };
              const moodEmojis: Record<string, string> = {
                positive: "😊",
                neutral: "😐",
                negative: "😔",
              };
              return (
                <div key={mood} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    {moodEmojis[mood]} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${moodColors[mood] || "bg-gray-500"}`}
                        style={{
                          width: `${(count / stats.totalEntries) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Tags */}
      {Object.keys(stats.tagUsage).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.tagUsage)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  #{tag}
                  <span className="text-blue-400">({count})</span>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
