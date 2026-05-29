/** Supported CSV format examples for Import page (English keys for i18n) */
export const importCsvFormats = [
  {
    id: 'generic',
    title: 'Generic CSV',
    description:
      "Use this format if your broker isn't listed or for custom CSV files. Supports comma, semicolon, or tab separators.",
    blocks: [
      {
        lines: [
          'Symbol,Date,Entry Price,Exit Price,Quantity,Side,Commission,Fees',
          'AAPL,2024-01-15,150.25,155.50,100,long,1.00,0.50',
          'TSLA,2024-01-16,200.00,,50,short,1.00,0.50',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Alternative column names:',
        text: 'Symbol/symbol, Date/Trade Date, Entry Price/Buy Price/Price, Exit Price/Sell Price, Quantity/Shares/Size, Side/Direction/Type, Commission/Fees',
      },
    ],
  },
  {
    id: 'lightspeed',
    title: 'Lightspeed Trader',
    description: 'Export from Lightspeed\'s "Reports" > "Trade Blotter" section as CSV.',
    blocks: [
      {
        lines: [
          'Symbol,Trade Date,Price,Qty,Side,Commission Amount,Execution Time,Trade Number',
          'AAPL,02/03/2025,150.25,100,B,1.00,09:30,12345',
          'AAPL,02/03/2025,155.50,100,S,1.00,14:30,12346',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Symbol, Trade Date, Price, Qty, Side (B/S), Commission Amount. Optional: Execution Time, Buy/Sell, Security Type, fee columns (FeeSEC, FeeMF, etc.)',
      },
    ],
  },
  {
    id: 'schwab',
    title: 'Charles Schwab',
    description:
      'Supports both completed trades export and transaction history. Tab-separated files are automatically detected.',
    blocks: [
      {
        heading: 'Completed Trades:',
        lines: [
          'Symbol,Opened Date,Closed Date,Quantity,Cost Per Share,Proceeds Per Share,Gain/Loss ($)',
          'AAPL,01/15/2024,01/15/2024,100,150.25,155.50,525.00',
        ],
      },
      {
        heading: 'Transaction History:',
        lines: [
          'Date,Action,Symbol,Description,Quantity,Price,Fees & Comm,Amount',
          '01/15/2024,Buy,AAPL,Buy,100,150.25,1.00,15026.00',
          '01/15/2024,Sell,AAPL,Sell,100,155.50,1.00,15549.00',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Supports both formats:',
        text: 'Completed trades with P&L or individual transactions. Auto-detects format and delimiter.',
      },
    ],
  },
  {
    id: 'thinkorswim',
    title: 'ThinkorSwim',
    description:
      'Export from ThinkorSwim\'s "Account Statement" section. Only processes trade (TRD) records.',
    blocks: [
      {
        lines: [
          'DATE,TIME,TYPE,REF #,DESCRIPTION,Commissions & Fees,Misc Fees',
          '01/15/2024,09:30:00,TRD,12345,"BOT +100 AAPL @150.25",1.00,0.00',
          '01/15/2024,10:45:00,TRD,12346,"SOLD -100 AAPL @155.50",1.00,0.00',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'DATE, TIME, TYPE (must be "TRD"), REF #, DESCRIPTION (BOT/SOLD format). Optional: Commissions & Fees, Misc Fees',
      },
    ],
  },
  {
    id: 'ibkr',
    title: 'Interactive Brokers',
    description:
      'Supports both Activity Statement and Trade Confirmation exports. Also supports Flex Query exports.',
    blocks: [
      {
        heading: 'Activity Statement:',
        lines: [
          'Symbol,Date/Time,Quantity,Price,Commission,Fees',
          'AAPL,2024-01-15 09:30:00,100,150.25,-1.00,0.00',
          'AAPL,2024-01-15 10:45:00,-100,155.50,-1.00,0.00',
        ],
      },
      {
        heading: 'Trade Confirmation:',
        lines: [
          'Symbol,UnderlyingSymbol,Strike,Expiry,Put/Call,Quantity,Multiplier,Buy/Sell,Date/Time,Price,Commission',
          'AAPL,,,,,,BUY,20240115;093000,150.25,-1.00',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Activity Statement:',
        text: 'Symbol, Date/Time or DateTime, Quantity (positive=buy, negative=sell), Price.',
      },
      {
        bold: 'Trade Confirmation:',
        text: 'Symbol, Buy/Sell, Date/Time, Price, UnderlyingSymbol, Strike, Expiry, Put/Call, Multiplier.',
      },
    ],
  },
  {
    id: 'webull',
    title: 'Webull',
    description:
      'Export from Webull\'s "Orders" > "Options Orders" history. Supports options trading with automatic roundtrip trade detection.',
    blocks: [
      {
        lines: [
          'Name,Symbol,Side,Status,Filled,Total Qty,Price,Avg Price,Time-in-Force,Placed Time,Filled Time',
          'SPY251114C00672000,SPY251114C00672000,Buy,Filled,3,3,1.82,1.82,DAY,11/14/2025 11:10:02 EST,11/14/2025 11:10:02 EST',
          'SPY251114C00672000,SPY251114C00672000,Sell,Filled,3,3,2.87,2.87,DAY,11/14/2025 11:31:56 EST,11/14/2025 11:31:56 EST',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Symbol, Side, Status, Filled, Avg Price, Filled Time. Automatically parses option symbols (format: SPY251114C00672000).',
      },
    ],
  },
  {
    id: 'etrade',
    title: 'E*TRADE',
    description: "Export from E*TRADE's transaction history.",
    blocks: [
      {
        lines: [
          'Symbol,Transaction Date,Transaction Type,Quantity,Price,Commission,Fees',
          'AAPL,01/15/2024,Buy,100,150.25,1.00,0.00',
          'AAPL,01/15/2024,Sell,100,155.50,1.00,0.00',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Symbol, Transaction Date, Transaction Type (Buy/Sell), Quantity, Price. Optional: Commission, Fees',
      },
    ],
  },
  {
    id: 'papermoney',
    title: 'PaperMoney',
    description:
      'Export from ThinkorSwim\'s PaperMoney platform. Filled orders are treated as actual executed trades for analysis and tracking.',
    blocks: [
      {
        heading: 'Filled Orders',
        lines: [
          ',,Exec Time,Spread,Side,Qty,Pos Effect,Symbol,Exp,Strike,Type,Price,Net Price,Price Improvement,Order Type',
          ',,9/19/25 13:24:32,STOCK,SELL,-100,TO CLOSE,FATN,,,STOCK,9.86,9.86,.00,MKT',
          ',,9/19/25 13:22:37,STOCK,BUY,+100,TO OPEN,FATN,,,STOCK,9.63,9.63,.00,MKT',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Exec Time, Side, Qty, Symbol, Price. Filled orders are processed as real trades and grouped into round-trip positions with P&L calculations.',
      },
    ],
  },
  {
    id: 'tradingview',
    title: 'TradingView',
    description:
      'Export filled orders from TradingView\'s paper or live trading. Supports futures contracts with leverage detection.',
    blocks: [
      {
        lines: [
          'Symbol,Side,Type,Qty,Fill Price,Commission,Placing Time,Closing Time,Order ID,Leverage',
          'CME_MINI:NQ1!,Buy,Market,1,25297,,2026-02-25 23:37:36,2026-02-25 23:37:36,2796864834,20:1',
          'CME_MINI:NQ1!,Sell,Limit,1,25419,,2026-02-25 23:38:50,2026-02-26 05:31:17,2796872396,',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Symbol, Side, Fill Price, Order ID. Optional: Status (if present, only "Filled" rows are imported), Qty, Type, Leverage, Commission, Placing Time/Closing Time.',
      },
    ],
  },
  {
    id: 'tradovate',
    title: 'Tradovate',
    description:
      'Export order history from Tradovate. Supports futures contracts with automatic contract month/year parsing and point value calculations.',
    blocks: [
      {
        lines: [
          'Contract,Product,Product Description,B/S,Status,Filled Qty,Avg Fill Price,Fill Time,Order ID',
          'MESZ5,MES,Micro E-mini S&P 500,Buy,Filled,1,6025.50,11/25/2025 09:38:24,12345',
          'MESZ5,MES,Micro E-mini S&P 500,Sell,Filled,1,6030.75,11/25/2025 10:15:10,12346',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Contract, Product, B/S, Filled Qty (or filledQty), Avg Fill Price (or avgPrice), Fill Time. Optional: Order ID, Status, Product Description.',
      },
    ],
  },
  {
    id: 'questrade',
    title: 'Questrade',
    description:
      'Export trade executions from Questrade. Supports stocks and options with automatic option symbol parsing.',
    blocks: [
      {
        lines: [
          'Symbol,Action,Fill qty,Fill price,Exec time,Account,Currency,Commission',
          'AAPL,Buy,100,150.25,16 Dec 2025 09:30:15 AM,ABC123,USD,4.95',
          'AAPL,Sell,100,155.50,16 Dec 2025 02:15:30 PM,ABC123,USD,4.95',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Symbol, Action (Buy/Sell/BTO/STC/BTC/STO), Fill qty, Fill price, Exec time. Optional: Account, Currency, Commission. Date format: DD Mon YYYY HH:MM:SS AM/PM.',
      },
    ],
  },
  {
    id: 'tradestation',
    title: 'TradeStation',
    description:
      'Export transaction history from TradeStation. Supports both equity and options trades with detailed fee breakdown.',
    blocks: [
      {
        lines: [
          'Account,T/D,S/D,Currency,Type,Side,Symbol,Qty,Price,Exec Time,Comm,SEC,TAF,NSCC,Nasdaq,ECN Remove,ECN Add,Gross Proceeds,Net Proceeds',
          'ABC123,01/15/25,01/17/25,USD,E,B,AAPL,100,150.50,09:30:15,4.95,0.01,0.01,0.01,0.00,0.00,0.00,15050.00,15045.02',
          'ABC123,01/15/25,01/17/25,USD,E,S,AAPL,100,152.25,14:20:30,4.95,0.01,0.01,0.01,0.00,0.00,0.00,15225.00,15220.02',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Account, T/D, S/D, Side, Symbol, Qty, Price, Exec Time, Gross Proceeds or Net Proceeds. All fee columns (Comm, SEC, TAF, NSCC, Nasdaq, ECN Remove, ECN Add) are automatically summed.',
      },
    ],
  },
  {
    id: 'tastytrade',
    title: 'Tastytrade',
    description:
      'Export transaction history from Tastytrade. Supports stocks, options, and futures with OCC option symbol parsing.',
    blocks: [
      {
        lines: [
          'Date,Type,Action,Symbol,Instrument Type,Quantity,Average Price,Root Symbol,Underlying Symbol,Expiration Date,Strike Price,Call or Put,Multiplier,Commissions,Fees',
          '2026-02-18T09:30:00-0500,Trade,BTO,IBM 260220C00265000,Option,5,2.15,IBM,IBM,2/20/26,265.00,Call,100,5.00,0.70',
          '2026-02-18T14:15:00-0500,Trade,STC,IBM 260220C00265000,Option,5,3.40,IBM,IBM,2/20/26,265.00,Call,100,5.00,0.70',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'Type (must be "Trade"), Action (Buy/Sell/BTO/STC/BTC/STO), Symbol, Instrument Type, Quantity, Average Price, Root Symbol, Underlying Symbol, Call or Put. Optional: Date, Expiration Date, Strike Price, Multiplier, Commissions, Fees.',
      },
    ],
  },
  {
    id: 'tradingview_performance',
    title: 'TradingView Performance',
    description:
      'Export performance data from TradingView. Contains completed trades with calculated P&L.',
    blocks: [
      {
        lines: [
          'symbol,buyFillId,sellFillId,qty,buyPrice,sellPrice,pnl,boughtTimestamp,soldTimestamp,duration',
          'AAPL,fill_001,fill_002,100,150.50,152.25,175.00,1736950800000,1736961600000,3h',
          'TSLA,fill_003,fill_004,50,225.75,220.50,-262.50,1736954400000,1736965200000,2h 40m',
        ],
      },
    ],
    footnotes: [
      {
        bold: 'Required columns:',
        text: 'symbol, qty, buyPrice, sellPrice, boughtTimestamp, soldTimestamp. Timestamps are Unix milliseconds.',
      },
    ],
  },
]
