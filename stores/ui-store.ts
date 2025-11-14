"use client";

import { create } from "zustand";
import type {
  ChartDataPoint,
  MarketData,
  MarketFilters,
  NewsItem
} from "../types/market-types";
import { apiService } from "../services/api-service";
import { DEFAULT_MARKET_ID } from "../app/data/mock-markets";

export type Timeframe = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL";
export type TradeSide = "buy" | "sell";

interface UiState {
  market?: MarketData | null;
  markets: MarketData[];
  relatedNews: NewsItem[];
  marketLoading: boolean;
  marketsLoading: boolean;
  newsLoading: boolean;
  error?: string;
  timeframe: Timeframe;
  newsTab: string;
  selectedOutcomeId?: string;
  tradeSide: TradeSide;
  tradeAmount: number;

  // actions
  setMarket: (m: MarketData | null) => void;
  setTimeframe: (tf: Timeframe) => void;
  setNewsTab: (tab: string) => void;
  setSelectedOutcomeId: (id?: string) => void;
  setTradeSide: (side: TradeSide) => void;
  setTradeAmount: (amt: number) => void;
  loadMarkets: (filters?: MarketFilters) => Promise<MarketData[]>;
  loadMarket: (id: string) => Promise<MarketData | null>;
  loadMarketChart: (id: string, timeframe?: Timeframe) => Promise<ChartDataPoint[]>;
  loadMarketNews: (id: string) => Promise<NewsItem[]>;
  clearError: () => void;
}

const fallbackTimeframe = (tf: Timeframe) => (tf === "ALL" ? "1D" : tf);

export const useUiStore = create<UiState>((set, get) => ({
  market: null,
  markets: [],
  relatedNews: [],
  marketLoading: false,
  marketsLoading: false,
  newsLoading: false,
  error: undefined,
  timeframe: "ALL",
  newsTab: "All",
  selectedOutcomeId: undefined,
  tradeSide: "buy",
  tradeAmount: 0,

  setMarket: (m) => set({ market: m }),
  setTimeframe: (tf) => set({ timeframe: tf }),
  setNewsTab: (tab) => set({ newsTab: tab }),
  setSelectedOutcomeId: (id) => set({ selectedOutcomeId: id }),
  setTradeSide: (side) => set({ tradeSide: side }),
  setTradeAmount: (amt) => set({ tradeAmount: Math.max(0, amt) }),
  loadMarkets: async (filters) => {
    set({ marketsLoading: true, error: undefined });
    try {
      const response = await apiService.getMarkets(filters);
      if (response.success) {
        set({ markets: response.data, marketsLoading: false });
        return response.data;
      }

      set({ marketsLoading: false, error: response.error ?? "Failed to load markets" });
      return [];
    } catch (error) {
      console.error("loadMarkets failed", error);
      set({ marketsLoading: false, error: error instanceof Error ? error.message : "Failed to load markets" });
      return [];
    }
  },
  loadMarket: async (id: string) => {
    const targetId = id || DEFAULT_MARKET_ID;
    set((state) => ({
      marketLoading: true,
      error: undefined,
      market: state.market && state.market.id === targetId ? state.market : null
    }));

    try {
      const response = await apiService.getMarket(targetId);
      if (!response.success || !response.data) {
        set({ market: null, marketLoading: false, error: response.error ?? "Market not found" });
        return null;
      }

      let market = response.data;
      const chartResponse = await apiService.getMarketChart(targetId, fallbackTimeframe(get().timeframe));
      if (chartResponse.success && chartResponse.data) {
        market = { ...market, chartData: chartResponse.data };
      }

      set({
        market,
        marketLoading: false,
        selectedOutcomeId: market.outcomes?.[0]?.id
      });

      return market;
    } catch (error) {
      console.error("loadMarket failed", error);
      set({
        market: null,
        marketLoading: false,
        error: error instanceof Error ? error.message : "Failed to load market"
      });
      return null;
    }
  },
  loadMarketChart: async (id: string, timeframe?: Timeframe) => {
    try {
      const response = await apiService.getMarketChart(id, fallbackTimeframe(timeframe ?? get().timeframe));
      if (response.success && response.data) {
        set((state) => {
          if (!state.market || state.market.id !== id) {
            return {};
          }
          return { market: { ...state.market, chartData: response.data } };
        });
        return response.data;
      }

      set({ error: response.error ?? "Failed to load chart data" });
      return [];
    } catch (error) {
      console.error("loadMarketChart failed", error);
      set({ error: error instanceof Error ? error.message : "Failed to load chart data" });
      return [];
    }
  },
  loadMarketNews: async (id: string) => {
    set({ newsLoading: true, error: undefined });
    try {
      const response = await apiService.getRelatedNews(id);
      if (response.success && response.data) {
        set({ relatedNews: response.data, newsLoading: false });
        return response.data;
      }

      set({ relatedNews: [], newsLoading: false, error: response.error ?? "Failed to load market news" });
      return [];
    } catch (error) {
      console.error("loadMarketNews failed", error);
      set({
        relatedNews: [],
        newsLoading: false,
        error: error instanceof Error ? error.message : "Failed to load market news"
      });
      return [];
    }
  },
  clearError: () => set({ error: undefined })
}));
