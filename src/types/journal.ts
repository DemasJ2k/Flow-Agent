export type EntryType = "general" | "trade" | "analysis" | "reflection";
export type Mood = "positive" | "neutral" | "negative";
export type TradeDirection = "long" | "short";
export type TradeOutcome = "win" | "loss" | "breakeven";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  entryType: EntryType;
  mood?: Mood | null;
  symbol?: string | null;
  tradeDirection?: TradeDirection | null;
  outcome?: TradeOutcome | null;
  pnl?: number | null;
  conversationId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryInput {
  title: string;
  content: string;
  tags?: string[];
  entryType?: EntryType;
  mood?: Mood | null;
  symbol?: string | null;
  tradeDirection?: TradeDirection | null;
  outcome?: TradeOutcome | null;
  pnl?: number | null;
  conversationId?: string | null;
}

export interface JournalStats {
  totalEntries: number;
  entryTypeBreakdown: Record<string, number>;
  moodBreakdown: Record<string, number>;
  trading: {
    totalTrades: number;
    outcomeBreakdown: Record<string, number>;
    totalPnl: number;
    avgWin: number;
    avgLoss: number;
    winRate: number;
    profitFactor: number;
  };
  tagUsage: Record<string, number>;
  entriesPerDay: Record<string, number>;
  currentStreak: number;
}

export interface JournalFilters {
  search?: string;
  entryType?: EntryType;
  tag?: string;
  mood?: Mood;
  outcome?: TradeOutcome;
  from?: string;
  to?: string;
}
