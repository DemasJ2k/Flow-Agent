# Position Sizing for Scalping

## Overview
Position sizing is the foundation of risk management in scalping. Proper position sizing ensures you can survive losing streaks, compound winners, and stay in the game long-term.

## Basic Position Sizing Concepts

### Risk Per Trade
- Maximum 1% of account per trade for scalping
- Conservative: 0.5% per trade
- Never more than 2% under any circumstances
- Fixed percentage, not fixed dollar amount

### The Formula
```
Position Size = Account Risk Amount / (Stop Loss in Pips × Pip Value)
```

### Pip Value Calculation
For standard lot (100,000 units):
- Most USD pairs: $10 per pip
- USD/JPY: ~$9.10 per pip (varies with exchange rate)
- Cross pairs: Calculate based on quote currency

## Step-by-Step Position Sizing

### Example 1: EUR/USD Trade
```
Account: $10,000
Risk: 1% = $100
Stop Loss: 8 pips
Pip Value per Standard Lot: $10

Position Size = $100 / (8 × $10) = $100 / $80 = 1.25 lots

Round down to 1.2 lots (conservative)
```

### Example 2: GBP/JPY Trade
```
Account: $5,000
Risk: 1% = $50
Stop Loss: 15 pips
Pip Value per Standard Lot: ~$9.10

Position Size = $50 / (15 × $9.10) = $50 / $136.50 = 0.37 lots

Round down to 0.35 lots
```

## Position Sizing Methods

### 1. Fixed Percentage
- Same percentage risk per trade
- Position size varies with stop distance
- Most common and recommended
- Adapts to account growth

### 2. Fixed Lot Size
- Same position size every trade
- Risk varies with stop distance
- Simpler but less flexible
- OK for very consistent stop distances

### 3. Volatility-Based
- Adjust size based on ATR
- Higher volatility = smaller size
- Lower volatility = larger size
- Advanced method

### 4. Kelly Criterion (Advanced)
```
Kelly % = W - [(1-W) / R]
W = Win rate (decimal)
R = Win/Loss ratio

Example:
Win Rate: 60% (0.60)
Average Win: $15
Average Loss: $10
R = 15/10 = 1.5

Kelly = 0.60 - [(1-0.60) / 1.5] = 0.60 - 0.267 = 0.333 or 33%

Use Half Kelly: 16.5% (still aggressive)
Conservative: 5-10%
```

## Quick Position Size Reference

### For 1% Risk
| Account | 5 Pip Stop | 10 Pip Stop | 15 Pip Stop |
|---------|------------|-------------|-------------|
| $1,000 | 0.20 lots | 0.10 lots | 0.07 lots |
| $5,000 | 1.00 lots | 0.50 lots | 0.33 lots |
| $10,000 | 2.00 lots | 1.00 lots | 0.67 lots |
| $25,000 | 5.00 lots | 2.50 lots | 1.67 lots |

### For 0.5% Risk (Conservative)
| Account | 5 Pip Stop | 10 Pip Stop | 15 Pip Stop |
|---------|------------|-------------|-------------|
| $1,000 | 0.10 lots | 0.05 lots | 0.03 lots |
| $5,000 | 0.50 lots | 0.25 lots | 0.17 lots |
| $10,000 | 1.00 lots | 0.50 lots | 0.33 lots |
| $25,000 | 2.50 lots | 1.25 lots | 0.83 lots |

## Account for Spread

### Spread Adjustment
```
True Stop = Stop Loss + Spread

If Stop Loss = 8 pips and Spread = 1.5 pips
True Risk = 9.5 pips

Recalculate position size with 9.5 pip stop
```

### Commission Adjustment
```
If broker charges $7 per lot round-trip:
Add equivalent pips to stop calculation

$7 / $10 per pip = 0.7 pips
Add 0.7 pips to stop distance calculation
```

## Position Sizing Rules

### Golden Rules
1. Calculate BEFORE entering trade
2. NEVER increase size on losing streak
3. Size down in high volatility
4. Account for spread and commission
5. Round DOWN, never up

### When to Reduce Size
- After 3 consecutive losses
- High volatility conditions
- Unfamiliar market conditions
- News events approaching
- Late in trading session

### When to Potentially Increase Size
- Proven strategy with track record
- High-confluence setups
- After significant account growth
- Optimal market conditions
- NEVER more than 2% regardless

## Multiple Open Positions

### Total Risk Management
```
If risking 1% per trade:
Maximum 3 correlated positions = 3% total risk
Maximum 5 positions total = 5% total risk
```

### Correlation Consideration
- EUR/USD and GBP/USD often correlate
- Count correlated positions as single larger position
- Diversify across different pairs/markets

## Position Sizing Mistakes

### Common Errors
- Not accounting for spread
- Rounding up position size
- Using fixed lot regardless of stop
- Increasing size to "make back" losses
- Ignoring correlation between positions
- Using full broker leverage

### The "Just This Once" Trap
- "I'll take a bigger position because I'm confident"
- "The setup is perfect, I'll risk 5%"
- These thoughts precede blow-ups
- Stick to your rules EVERY time

## Position Size Calculator

### Build Your Own
```
Input Fields:
- Account Balance
- Risk Percentage
- Stop Loss (pips)
- Currency Pair (for pip value)

Output:
- Position Size (lots)
- Dollar Risk
- Pip Value
```

### Online Calculators
- Myfxbook position size calculator
- BabyPips position calculator
- Broker-provided calculators
- Build into trading spreadsheet

## Compounding with Position Sizing

### How Compounding Works
- Risk percentage stays constant
- As account grows, position size grows
- Losses also scale with account
- Accelerates both gains and losses

### Example
```
Starting: $10,000 account, 1% risk = $100/trade
After growth: $15,000 account, 1% risk = $150/trade
Position size increases with account growth
```

## Summary

Position sizing fundamentals:
- Risk 0.5-1% per scalp trade
- Calculate based on stop distance
- Account for spread and commission
- Never exceed limits regardless of "confidence"
- Size down in challenging conditions
- Let compounding work through consistent percentage risk

Proper position sizing is what separates professional traders from gamblers. It's not exciting, but it keeps you in the game.
