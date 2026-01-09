# Scalping Risk Management

## Overview
Risk management is even more critical in scalping than other trading styles due to the high frequency of trades and small profit targets. Proper risk management is the difference between consistent profits and account destruction.

## Position Sizing

### The 1% Rule
- Never risk more than 1% of account per trade
- For scalping, consider 0.5% or less
- More trades = need for smaller individual risk
- Protects against losing streaks

### Calculating Position Size
```
Position Size = (Account Risk) / (Stop Loss in Pips × Pip Value)

Example:
Account: $10,000
Risk: 1% = $100
Stop Loss: 10 pips
Pip Value: $10 per pip (1 standard lot)

Position Size = $100 / (10 × $10) = 1 mini lot (0.1 standard)
```

### Scaling by Account Size
| Account Size | Max Risk | Max Loss per Trade |
|--------------|----------|-------------------|
| $1,000 | 0.5-1% | $5-10 |
| $5,000 | 0.5-1% | $25-50 |
| $10,000 | 0.5-1% | $50-100 |
| $25,000 | 0.5-1% | $125-250 |

## Stop Loss Management

### Stop Loss Placement
- Always use a stop loss - NO EXCEPTIONS
- Place beyond entry signal invalidation point
- Account for spread in stop calculation
- Never move stop further from entry

### Stop Loss Types

#### Fixed Pip Stop
- Same pip distance for all trades
- Simple to calculate
- May not fit all setups
- Common: 5-15 pips for scalping

#### Structure-Based Stop
- Beyond recent swing high/low
- Beyond candlestick formation
- More logical placement
- Variable distance

#### ATR-Based Stop
- Use Average True Range indicator
- Stop = 1-1.5x ATR value
- Adapts to market volatility
- Objective placement

## Take Profit Strategy

### Fixed Take Profit
- Same pip target for all trades
- Easy to manage
- May leave money on table
- Common: 5-15 pips for scalping

### Risk:Reward Ratio
- Minimum 1:1 R:R for scalping
- Ideally 1.5:1 or 2:1
- Higher R:R = can have lower win rate
- Calculate before every entry

### Partial Take Profit
- Close 50% at first target
- Move stop to breakeven
- Let rest run to second target
- Locks in profit while keeping upside

## Daily Loss Limits

### Maximum Daily Loss
- Set maximum loss for the day
- Common: 3% of account
- Stop trading when limit hit
- Prevents revenge trading

### Loss Streak Protocol
1. After 3 consecutive losses: Take 15-minute break
2. After 5 consecutive losses: Stop for 1 hour
3. After reaching daily limit: Stop for the day
4. Review losses before next session

### Win Limit (Optional)
- Consider stopping after large win
- Prevents giving back profits
- Maintains discipline
- Ends day on positive note

## Trade Management

### Breakeven Stop
- Move stop to entry after 1:1 R:R reached
- Eliminates risk from winning trade
- Common practice in scalping
- May result in more breakeven exits

### Trailing Stop
- Move stop as trade moves in favor
- Lock in profits as trade progresses
- Various methods (fixed, ATR, swing)
- Good for extended scalp moves

### Time-Based Exit
- Exit if trade doesn't move within X minutes
- Frees capital for other opportunities
- Common: 5-15 minutes maximum hold
- Prevents tying up margin

## Spread Awareness

### Spread Impact on Scalping
- Spread eats into small profits
- Higher spread = harder to profit
- Major pairs: 0.5-2 pips typical
- Exotic pairs: Avoid for scalping

### Break-Even Calculation
```
Break-Even Pips = Spread + Commission (if any)

Example:
Spread: 1 pip
Commission: 0.5 pip equivalent
Break-Even: 1.5 pips

Your take profit must exceed 1.5 pips to profit
```

### When to Avoid Trading
- Spread wider than 50% of target
- During low liquidity periods
- Around major news events
- Asian session for major pairs

## Leverage Management

### Appropriate Leverage
- Lower leverage = safer
- Scalpers often use higher leverage
- Never use full available leverage
- Match leverage to stop loss size

### Leverage Guidelines
| Account Size | Suggested Max Leverage |
|--------------|----------------------|
| < $5,000 | 10:1 |
| $5,000 - $25,000 | 20:1 |
| > $25,000 | 30:1 |

### Margin Usage
- Never use more than 20-30% of margin
- Leave room for drawdown
- Avoid margin calls at all costs
- Multiple open trades = more risk

## Record Keeping

### Trade Journal Requirements
- Entry and exit price
- Position size
- Stop loss and take profit levels
- Entry reason
- Exit reason
- Outcome (P/L)
- Screenshot if possible

### Metrics to Track
- Win rate
- Average win vs average loss
- Profit factor
- Maximum drawdown
- Best/worst trading times
- Best/worst setups

## Psychological Risk Management

### Emotional Control
- Never trade when emotional
- Stick to your plan
- Accept losses as cost of business
- Don't revenge trade

### Mental Stops
- Recognize tilt (emotional state)
- Have predetermined walk-away points
- Practice breathing exercises
- Take regular breaks

## Risk Management Checklist

Before each trade:
- [ ] Position size calculated correctly?
- [ ] Stop loss placed?
- [ ] Risk within 1% limit?
- [ ] R:R acceptable (minimum 1:1)?
- [ ] Spread checked?
- [ ] Daily loss limit not reached?
- [ ] Not in emotional state?

## Common Risk Mistakes

### What to Avoid
- No stop loss
- Moving stop loss further away
- Averaging down on losers
- Over-leveraging
- Trading without a plan
- Ignoring daily limits
- Trading through major news

## Summary

Scalping risk management essentials:
- Risk 0.5-1% maximum per trade
- Always use stop losses
- Minimum 1:1 risk:reward
- Set daily loss limits
- Account for spread costs
- Keep detailed records
- Manage emotions

Protect your capital first. Profits will follow from consistent risk management and disciplined execution.
