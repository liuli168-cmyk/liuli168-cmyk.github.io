# Tesla Covered Call Dashboard

## Overview
Password-protected dashboard tracking your 25 Tesla covered call positions with real-time option prices updated daily at market close.

## Access
**URL:** https://liuli168-cmyk.github.io/tesla-dashboard.html  
**Password:** `781006`

## Features
- 🔒 Password protected access
- 📊 Real-time Tesla stock price
- 💰 Daily option prices (bid/ask/last/mid)
- 📈 Implied volatility for each position
- 💵 Buyback cost calculations
- ⚠️ Assignment risk alerts
- 🎯 Action suggestions (Roll Up, Buy Back, Hold, Monitor)
- 📱 Mobile responsive

## Daily Updates
Option prices are automatically fetched and updated daily at **3 PM CT** (market close) on weekdays.

### Manual Update
To manually update option prices:
```bash
cd ~/.openclaw/workspace/tesla-dashboard
./update_and_deploy.sh
```

### Automated Daily Updates (Setup)
To enable automatic daily updates, set up a cron job:

```bash
# Edit crontab
crontab -e

# Add this line (runs at 3 PM CT on weekdays):
0 15 * * 1-5 /Users/huangrongbot/.openclaw/workspace/tesla-dashboard/update_and_deploy.sh >> /tmp/tesla-dashboard-update.log 2>&1
```

Or use OpenClaw gateway to restart and set up the cron through the cron tool.

## Dashboard Columns
- **Strike:** Option strike price
- **Exp:** Expiration date
- **Qty:** Number of contracts
- **Days:** Days until expiration (color-coded: red <30, yellow <90, green >90)
- **Status:** ITM (In The Money), ATM (At The Money), OTM (Out of The Money)
- **Bid/Ask/Last/Mid:** Current option prices
- **Buyback Cost:** Total cost to buy back all contracts + per-contract cost
- **IV%:** Implied volatility
- **Action:** Suggested action based on current market conditions

## Buyback Cost Color Coding
- 🟢 **Green:** <$10/contract (good buyback opportunity)
- 🟡 **Yellow:** $10-$20/contract (okay, consider timing)
- 🔴 **Red:** >$20/contract (expensive, consider rolling instead)

## Files
- `index.html` - Dashboard web page
- `option_prices.json` - Daily option price data
- `fetch_option_prices.py` - Python script to fetch prices from Yahoo Finance
- `update_and_deploy.sh` - Automated update and deployment script

## Data Source
Option prices are fetched from Yahoo Finance API with 15-minute delays during market hours. Prices shown are for informational purposes and may not reflect real-time trading prices.

## Security
- Dashboard uses sessionStorage for authentication (persists only while browser tab is open)
- Click "Logout" button to lock the dashboard
- Data is publicly accessible on GitHub Pages but password-protected for viewing

## Troubleshooting

### Dashboard shows old data
1. Check when the data was last updated (shown at bottom of dashboard)
2. Manually run: `./update_and_deploy.sh`
3. Refresh the browser page (Cmd+R or Ctrl+R)

### Option prices not loading
1. Check if `option_prices.json` exists in the workspace
2. Run `python3 fetch_option_prices.py` manually to test
3. Check for API rate limiting (Yahoo Finance has limits)

### Automatic updates not working
1. Verify crontab is configured: `crontab -l`
2. Check logs: `tail -f /tmp/tesla-dashboard-update.log`
3. Test the script manually: `./update_and_deploy.sh`

## Future Enhancements
- [ ] Historical price tracking and charts
- [ ] Profit/loss calculations
- [ ] Email/Telegram alerts for buyback opportunities
- [ ] Roll calculator (compare current vs new strikes)
- [ ] Integration with your brokerage for real-time data
