// Strategy Types
export type RiskLevel = "low" | "medium" | "high";

export type Timeframe =
  | "1m" | "5m" | "15m" | "30m"
  | "1h" | "4h"
  | "1d" | "1w" | "1M";

export type Market =
  | "forex" | "crypto" | "stocks"
  | "indices" | "commodities" | "metals";

export interface Strategy {
  id: string;
  name: string;
  description: string | null;
  content: string;
  category: string;
  tags: string[];
  timeframes: Timeframe[];
  markets: Market[];
  riskLevel: RiskLevel;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyInput {
  name: string;
  description?: string | null;
  content: string;
  category?: string;
  tags?: string[];
  timeframes?: Timeframe[];
  markets?: Market[];
  riskLevel?: RiskLevel;
  isPublic?: boolean;
}

export interface StrategyFilters {
  search?: string;
  category?: string;
  market?: Market;
  timeframe?: Timeframe;
  riskLevel?: RiskLevel;
  tag?: string;
}

// Tool Types
export type ToolType =
  | "indicator"
  | "oscillator"
  | "overlay"
  | "pattern"
  | "calculator"
  | "screener"
  | "other";

export interface Tool {
  id: string;
  name: string;
  description: string | null;
  content: string;
  category: string;
  tags: string[];
  url: string | null;
  toolType: ToolType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolInput {
  name: string;
  description?: string | null;
  content: string;
  category?: string;
  tags?: string[];
  url?: string | null;
  toolType?: ToolType;
}

export interface ToolFilters {
  search?: string;
  category?: string;
  toolType?: ToolType;
  tag?: string;
}

// Playbook Types
export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  checkpoints: string[];
  notes?: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string | null;
  steps: PlaybookStep[];
  category: string;
  tags: string[];
  strategyId: string | null;
  strategy?: Strategy | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybookInput {
  name: string;
  description?: string | null;
  steps?: PlaybookStep[];
  category?: string;
  tags?: string[];
  strategyId?: string | null;
}

export interface PlaybookFilters {
  search?: string;
  category?: string;
  strategyId?: string;
  tag?: string;
}

// Constants
export const STRATEGY_CATEGORIES = [
  "ICT Concepts",
  "Price Action",
  "Scalping",
  "Swing Trading",
  "Day Trading",
  "Position Trading",
  "Trend Following",
  "Mean Reversion",
  "Breakout",
  "General",
] as const;

export const TOOL_CATEGORIES = [
  "Technical Indicators",
  "Volume Analysis",
  "Price Patterns",
  "Market Structure",
  "Risk Management",
  "Position Sizing",
  "Backtesting",
  "Journaling",
  "General",
] as const;

export const PLAYBOOK_CATEGORIES = [
  "Pre-Market Routine",
  "Trade Entry",
  "Trade Management",
  "Trade Exit",
  "Post-Trade Review",
  "Weekly Review",
  "Risk Management",
  "Psychology",
  "General",
] as const;

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "Daily" },
  { value: "1w", label: "Weekly" },
  { value: "1M", label: "Monthly" },
];

export const MARKETS: { value: Market; label: string }[] = [
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "stocks", label: "Stocks" },
  { value: "indices", label: "Indices" },
  { value: "commodities", label: "Commodities" },
  { value: "metals", label: "Metals" },
];

export const RISK_LEVELS: { value: RiskLevel; label: string; color: string }[] = [
  { value: "low", label: "Low Risk", color: "green" },
  { value: "medium", label: "Medium Risk", color: "yellow" },
  { value: "high", label: "High Risk", color: "red" },
];

export const TOOL_TYPES: { value: ToolType; label: string }[] = [
  { value: "indicator", label: "Indicator" },
  { value: "oscillator", label: "Oscillator" },
  { value: "overlay", label: "Overlay" },
  { value: "pattern", label: "Pattern Recognition" },
  { value: "calculator", label: "Calculator" },
  { value: "screener", label: "Screener" },
  { value: "other", label: "Other" },
];
