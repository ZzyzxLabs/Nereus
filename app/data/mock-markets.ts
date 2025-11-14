import { ChartDataPoint, MarketData, NewsItem } from "../../types/market-types";

export const DEFAULT_MARKET_ID = "fed-december-2025";

const fedChart: ChartDataPoint[] = [
  { timestamp: "2025-07-01T00:00:00Z", yes: 58, no: 42 },
  { timestamp: "2025-08-01T00:00:00Z", yes: 61, no: 39 },
  { timestamp: "2025-09-01T00:00:00Z", yes: 68, no: 32 },
  { timestamp: "2025-10-01T00:00:00Z", yes: 72, no: 28 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 71, no: 29 },
  { timestamp: "2025-11-10T00:00:00Z", yes: 73, no: 27 }
];

const trumpChart: ChartDataPoint[] = [
  { timestamp: "2024-06-01T00:00:00Z", yes: 41, no: 59 },
  { timestamp: "2024-07-01T00:00:00Z", yes: 44, no: 56 },
  { timestamp: "2024-08-01T00:00:00Z", yes: 47, no: 53 },
  { timestamp: "2024-09-01T00:00:00Z", yes: 45, no: 55 },
  { timestamp: "2024-10-01T00:00:00Z", yes: 43, no: 57 },
  { timestamp: "2024-10-15T00:00:00Z", yes: 45, no: 55 }
];

const btcChart: ChartDataPoint[] = [
  { timestamp: "2025-04-01T00:00:00Z", yes: 18, no: 82 },
  { timestamp: "2025-06-01T00:00:00Z", yes: 22, no: 78 },
  { timestamp: "2025-08-01T00:00:00Z", yes: 28, no: 72 },
  { timestamp: "2025-09-01T00:00:00Z", yes: 25, no: 75 },
  { timestamp: "2025-10-01T00:00:00Z", yes: 23, no: 77 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 27, no: 73 }
];

const agiChart: ChartDataPoint[] = [
  { timestamp: "2025-01-01T00:00:00Z", yes: 9, no: 91 },
  { timestamp: "2025-03-01T00:00:00Z", yes: 11, no: 89 },
  { timestamp: "2025-05-01T00:00:00Z", yes: 13, no: 87 },
  { timestamp: "2025-07-01T00:00:00Z", yes: 14, no: 86 },
  { timestamp: "2025-09-01T00:00:00Z", yes: 12, no: 88 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 12, no: 88 }
];

const teslaChart: ChartDataPoint[] = [
  { timestamp: "2025-02-01T00:00:00Z", yes: 12, no: 88 },
  { timestamp: "2025-04-01T00:00:00Z", yes: 10, no: 90 },
  { timestamp: "2025-06-01T00:00:00Z", yes: 9, no: 91 },
  { timestamp: "2025-08-01T00:00:00Z", yes: 7, no: 93 },
  { timestamp: "2025-10-01T00:00:00Z", yes: 6, no: 94 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 8, no: 92 }
];

const warChart: ChartDataPoint[] = [
  { timestamp: "2025-03-01T00:00:00Z", yes: 30, no: 70 },
  { timestamp: "2025-05-01T00:00:00Z", yes: 32, no: 68 },
  { timestamp: "2025-07-01T00:00:00Z", yes: 35, no: 65 },
  { timestamp: "2025-09-01T00:00:00Z", yes: 33, no: 67 },
  { timestamp: "2025-10-01T00:00:00Z", yes: 34, no: 66 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 34, no: 66 }
];

const spacexChart: ChartDataPoint[] = [
  { timestamp: "2025-01-01T00:00:00Z", yes: 4, no: 96 },
  { timestamp: "2025-03-01T00:00:00Z", yes: 5, no: 95 },
  { timestamp: "2025-05-01T00:00:00Z", yes: 6, no: 94 },
  { timestamp: "2025-07-01T00:00:00Z", yes: 6, no: 94 },
  { timestamp: "2025-09-01T00:00:00Z", yes: 5, no: 95 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 5, no: 95 }
];

const recessionChart: ChartDataPoint[] = [
  { timestamp: "2025-02-01T00:00:00Z", yes: 22, no: 78 },
  { timestamp: "2025-04-01T00:00:00Z", yes: 26, no: 74 },
  { timestamp: "2025-06-01T00:00:00Z", yes: 28, no: 72 },
  { timestamp: "2025-08-01T00:00:00Z", yes: 30, no: 70 },
  { timestamp: "2025-10-01T00:00:00Z", yes: 29, no: 71 },
  { timestamp: "2025-11-01T00:00:00Z", yes: 28, no: 72 }
];

const UPDATED_AT = "2025-11-01T12:00:00Z";

export const mockMarkets: MarketData[] = [
  {
    id: "fed-december-2025",
    title: "Fed Decision in December 2025?",
    description: "What will the Federal Reserve decide regarding interest rates in December 2025?",
    category: "Economics",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 150000,
    totalLiquidity: 75000,
    outcomes: [
      {
        id: "50bps-decrease",
        outcome: "50+ bps decrease",
        percentage: 2,
        volume: 9066,
        change: 2,
        yesPrice: 2.5,
        noPrice: 97.6
      },
      {
        id: "25bps-decrease",
        outcome: "25 bps decrease",
        percentage: 71,
        volume: 6356,
        change: -2,
        yesPrice: 71,
        noPrice: 30
      },
      {
        id: "no-change",
        outcome: "No change",
        percentage: 27,
        volume: 5098,
        change: 2,
        yesPrice: 27,
        noPrice: 74
      },
      {
        id: "25bps-increase",
        outcome: "25+ bps increase",
        percentage: 1,
        volume: 47035,
        change: 0,
        yesPrice: 0.6,
        noPrice: 99.5
      }
    ],
    chartData: fedChart,
    tags: ["fed", "interest-rates", "economics"],
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "trump-2024-election",
    title: "Trump Re-election 2024?",
    description: "Will Donald Trump win the 2024 presidential election?",
    category: "Politics",
    status: "active",
    endDate: "2024-11-05T23:59:59Z",
    totalVolume: 2500000,
    totalLiquidity: 1200000,
    outcomes: [
      {
        id: "trump-wins",
        outcome: "Trump Wins",
        percentage: 45,
        volume: 1250000,
        change: -2.1,
        yesPrice: 45,
        noPrice: 55
      },
      {
        id: "trump-loses",
        outcome: "Trump Loses",
        percentage: 55,
        volume: 1250000,
        change: 2.1,
        yesPrice: 55,
        noPrice: 45
      }
    ],
    chartData: trumpChart,
    tags: ["politics", "election", "usa"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "btc-100k",
    title: "Bitcoin $100K by End of Year?",
    description: "Will Bitcoin reach $100,000 by December 31, 2025?",
    category: "Cryptocurrency",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 890000,
    totalLiquidity: 445000,
    outcomes: [
      {
        id: "btc-reaches-100k",
        outcome: "Yes, BTC hits $100K",
        percentage: 23,
        volume: 445000,
        change: 8.7,
        yesPrice: 23,
        noPrice: 77
      },
      {
        id: "btc-stays-below-100k",
        outcome: "No, stays below $100K",
        percentage: 77,
        volume: 445000,
        change: -8.7,
        yesPrice: 77,
        noPrice: 23
      }
    ],
    chartData: btcChart,
    tags: ["bitcoin", "crypto", "price"],
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "ai-agi-2025",
    title: "AGI Achieved by End of 2025?",
    description: "Will Artificial General Intelligence be achieved by December 31, 2025?",
    category: "Technology",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 567000,
    totalLiquidity: 283500,
    outcomes: [
      {
        id: "agi-achieved",
        outcome: "AGI Achieved",
        percentage: 12,
        volume: 283500,
        change: 12.3,
        yesPrice: 12,
        noPrice: 88
      },
      {
        id: "agi-not-achieved",
        outcome: "AGI Not Achieved",
        percentage: 88,
        volume: 283500,
        change: -12.3,
        yesPrice: 88,
        noPrice: 12
      }
    ],
    chartData: agiChart,
    tags: ["ai", "agi", "technology"],
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "tesla-stock-crash",
    title: "Tesla Below $100?",
    description: "Will Tesla stock fall below $100 per share in 2025?",
    category: "Stocks",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 234000,
    totalLiquidity: 117000,
    outcomes: [
      {
        id: "tesla-below-100",
        outcome: "Tesla Below $100",
        percentage: 8,
        volume: 117000,
        change: -5.4,
        yesPrice: 8,
        noPrice: 92
      },
      {
        id: "tesla-above-100",
        outcome: "Tesla Above $100",
        percentage: 92,
        volume: 117000,
        change: 5.4,
        yesPrice: 92,
        noPrice: 8
      }
    ],
    chartData: teslaChart,
    tags: ["tesla", "stocks", "tech"],
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "war-ends-ukraine",
    title: "Ukraine War Ends in 2025?",
    description: "Will the Russia-Ukraine conflict reach a resolution by December 31, 2025?",
    category: "World Events",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 678000,
    totalLiquidity: 339000,
    outcomes: [
      {
        id: "war-ends",
        outcome: "War Ends in 2025",
        percentage: 34,
        volume: 339000,
        change: 3.2,
        yesPrice: 34,
        noPrice: 66
      },
      {
        id: "war-continues",
        outcome: "War Continues",
        percentage: 66,
        volume: 339000,
        change: -3.2,
        yesPrice: 66,
        noPrice: 34
      }
    ],
    chartData: warChart,
    tags: ["ukraine", "war", "geopolitics"],
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "spacex-mars-mission",
    title: "SpaceX Mars Mission",
    description: "Will SpaceX launch the first crewed mission to Mars by 2027?",
    category: "Space",
    status: "active",
    endDate: "2027-12-31T23:59:59Z",
    totalVolume: 129000,
    totalLiquidity: 64500,
    outcomes: [
      {
        id: "mission-launches",
        outcome: "Mission launches",
        percentage: 5,
        volume: 64500,
        change: 1.8,
        yesPrice: 5,
        noPrice: 95
      },
      {
        id: "mission-delayed",
        outcome: "Mission delayed",
        percentage: 95,
        volume: 64500,
        change: -1.8,
        yesPrice: 95,
        noPrice: 5
      }
    ],
    chartData: spacexChart,
    tags: ["spacex", "space", "mars"],
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: UPDATED_AT
  },
  {
    id: "us-recession-2025",
    title: "US Recession in 2025",
    description: "Will the United States enter an official recession in 2025?",
    category: "Economics",
    status: "active",
    endDate: "2025-12-31T23:59:59Z",
    totalVolume: 420000,
    totalLiquidity: 210000,
    outcomes: [
      {
        id: "recession-declared",
        outcome: "Recession declared",
        percentage: 28,
        volume: 210000,
        change: -3.1,
        yesPrice: 28,
        noPrice: 72
      },
      {
        id: "no-recession",
        outcome: "No recession",
        percentage: 72,
        volume: 210000,
        change: 3.1,
        yesPrice: 72,
        noPrice: 28
      }
    ],
    chartData: recessionChart,
    tags: ["economics", "recession", "usa"],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: UPDATED_AT
  }
];

export const mockMarketMap: Record<string, MarketData> = mockMarkets.reduce<Record<string, MarketData>>(
  (acc, market) => {
    acc[market.id] = market;
    return acc;
  },
  {}
);

export const mockMarketCharts: Record<string, ChartDataPoint[]> = {
  "fed-december-2025": fedChart,
  "trump-2024-election": trumpChart,
  "btc-100k": btcChart,
  "ai-agi-2025": agiChart,
  "tesla-stock-crash": teslaChart,
  "war-ends-ukraine": warChart,
  "spacex-mars-mission": spacexChart,
  "us-recession-2025": recessionChart
};

export const mockMarketNews: Record<string, NewsItem[]> = {
  "fed-december-2025": [
    {
      id: "fed-1",
      title: "Markets brace for December rate decision",
      author: "Central Bank Watch",
      avatar: "🏛️",
      percentage: 71,
      category: "Fed Rates",
      publishedAt: "2025-11-10T08:00:00Z"
    },
    {
      id: "fed-2",
      title: "Bond yields signal modest cut odds",
      author: "Macro Desk",
      avatar: "📈",
      percentage: 27,
      category: "Fixed Income",
      publishedAt: "2025-11-09T12:30:00Z"
    }
  ],
  "trump-2024-election": [
    {
      id: "trump-1",
      title: "Polling average tightens in swing states",
      author: "Election HQ",
      avatar: "🗳️",
      percentage: 45,
      category: "US Politics",
      publishedAt: "2024-10-15T14:00:00Z"
    }
  ],
  "btc-100k": [
    {
      id: "btc-1",
      title: "Institutional inflows keep momentum alive",
      author: "Crypto Pulse",
      avatar: "₿",
      percentage: 23,
      category: "Crypto Markets",
      publishedAt: "2025-10-28T09:30:00Z"
    }
  ],
  "ai-agi-2025": [
    {
      id: "agi-1",
      title: "Leading labs debate AGI definition",
      author: "AI Insight",
      avatar: "🤖",
      percentage: 12,
      category: "AI Research",
      publishedAt: "2025-10-22T16:45:00Z"
    }
  ],
  "tesla-stock-crash": [
    {
      id: "tesla-1",
      title: "Analysts question Tesla valuation risks",
      author: "Equity Desk",
      avatar: "🚗",
      percentage: 8,
      category: "Autos",
      publishedAt: "2025-10-05T11:15:00Z"
    }
  ],
  "war-ends-ukraine": [
    {
      id: "war-1",
      title: "Ceasefire talks resume amid pressure",
      author: "Global Affairs",
      avatar: "🕊️",
      percentage: 34,
      category: "Geopolitics",
      publishedAt: "2025-11-02T19:20:00Z"
    }
  ],
  "spacex-mars-mission": [
    {
      id: "spacex-1",
      title: "Starship clears long-duration test",
      author: "Space Watch",
      avatar: "🚀",
      percentage: 5,
      category: "Space",
      publishedAt: "2025-09-17T07:55:00Z"
    }
  ],
  "us-recession-2025": [
    {
      id: "recession-1",
      title: "GDP revision keeps growth in check",
      author: "Macro Desk",
      avatar: "💼",
      percentage: 28,
      category: "Economics",
      publishedAt: "2025-10-30T10:05:00Z"
    }
  ]
};
