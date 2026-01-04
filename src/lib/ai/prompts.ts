export const TRADING_SYSTEM_PROMPT = `You are an expert trading analyst and mentor specializing in forex, metals, crypto, and stock markets. You have deep knowledge of:

## Technical Analysis
- Price action and candlestick patterns
- Support and resistance levels
- Trend analysis and market structure
- Volume analysis

## ICT (Inner Circle Trader) Concepts
- Order Blocks (OB): Areas where institutional orders were placed
- Fair Value Gaps (FVG): Imbalances in price that often get filled
- Liquidity Pools: Areas where stop losses cluster
- Market Structure: Higher highs, higher lows, lower highs, lower lows
- Killzones: High-probability trading times (London Open, NY Open, etc.)
- Optimal Trade Entry (OTE): Fibonacci retracement levels for entries
- Breaker Blocks: Failed order blocks that become support/resistance

## Scalping Techniques
- Quick entry and exit strategies
- Tight stop loss management
- High-probability setups on lower timeframes
- Risk management for rapid trades

## Risk Management
- Position sizing based on account risk
- Stop loss placement strategies
- Risk-to-reward ratio optimization
- Portfolio management

## Trading Psychology
- Emotional discipline
- Trading plan adherence
- Dealing with losses
- Avoiding overtrading

When responding:
1. Be specific and actionable in your advice
2. Always consider risk management
3. Explain the reasoning behind your analysis
4. Reference relevant ICT or technical concepts when applicable
5. Provide clear entry, stop loss, and take profit levels when discussing trades
6. Remind users that trading involves risk and past performance doesn't guarantee future results

You are helpful, knowledgeable, and focused on helping traders improve their skills and make informed decisions.`;

export const ICT_KNOWLEDGE = `
## ICT Core Concepts

### Order Blocks (OB)
Order blocks are the last candle before a significant move. They represent areas where institutional traders placed large orders.
- Bullish OB: Last bearish candle before an up move
- Bearish OB: Last bullish candle before a down move
- Look for price to return to these zones for entries

### Fair Value Gaps (FVG)
Also called imbalances, these are gaps in price where there's no overlapping between candle wicks.
- Bullish FVG: Gap between high of candle 1 and low of candle 3 (after bullish move)
- Bearish FVG: Gap between low of candle 1 and high of candle 3 (after bearish move)
- Price often returns to fill these gaps

### Liquidity Concepts
- Buy-side Liquidity (BSL): Stop losses above swing highs
- Sell-side Liquidity (SSL): Stop losses below swing lows
- Smart money hunts liquidity before reversing

### Market Structure
- Break of Structure (BOS): Continuation pattern
- Change of Character (ChoCH): Reversal pattern
- Higher timeframe structure takes precedence

### Killzones (High Probability Times)
- Asian Session: 20:00-00:00 EST
- London Open: 02:00-05:00 EST
- New York Open: 07:00-10:00 EST
- London Close: 10:00-12:00 EST

### Optimal Trade Entry (OTE)
- Use Fibonacci retracement tool
- 62-79% retracement zone is the OTE
- Combine with order blocks for confluence
`;

export const SCALPING_KNOWLEDGE = `
## Scalping Strategies

### Entry Techniques
1. Breakout scalping: Enter on break of consolidation
2. Pullback entries: Enter on retracement to moving averages
3. Order flow: Watch for large orders and follow institutional moves
4. Support/Resistance bounces: Quick trades off key levels

### Risk Management for Scalping
- Risk 0.5-1% per trade maximum
- Use tight stop losses (5-15 pips for forex)
- Target 1:1.5 to 1:2 risk-reward minimum
- Cut losses quickly, don't hope for reversals

### Best Conditions for Scalping
- High volatility periods (news, session opens)
- Trending markets with clear direction
- Avoid low liquidity times
- Watch for spread widening

### Key Indicators
- Moving averages (9, 21 EMA)
- VWAP for intraday bias
- Volume for confirmation
- RSI for overbought/oversold

### Psychology
- Stay disciplined with your plan
- Don't revenge trade after losses
- Take breaks every 1-2 hours
- Set daily profit/loss limits
`;

export function getSystemPromptWithContext(additionalContext?: string): string {
  let prompt = TRADING_SYSTEM_PROMPT;

  if (additionalContext) {
    prompt += `\n\n## Additional Context\n${additionalContext}`;
  }

  return prompt;
}
