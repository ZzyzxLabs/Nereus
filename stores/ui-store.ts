"use client";

import { create } from "zustand";
import type { MarketData } from "../types/market-types";

export type Timeframe = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL";
export type TradeSide = "buy" | "sell";

interface UiState {
  market?: MarketData | null;
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
}

export const useUiStore = create<UiState>((set) => ({
  market: null,
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
}));
