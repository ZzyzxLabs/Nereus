"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Navbar from "../../components/navbar";
import MarketChart from "../../components/market-chart";
import MarketOutcome from "../../components/market-outcome";
import TradingPanel from "../../components/trading-panel";
import { useUiStore } from "../../stores/ui-store";
import type { MarketData } from "../../types/market-types";
import { getCategoryIcon } from "../../lib/category";
import { DEFAULT_MARKET_ID } from "../data/mock-markets";

export default function MarketPage() {
    const searchParams = useSearchParams();
    const marketId = searchParams.get("id") || DEFAULT_MARKET_ID;

    const { market, marketLoading, loadMarket } = useUiStore((state) => ({
        market: state.market,
        marketLoading: state.marketLoading,
        loadMarket: state.loadMarket
    }));

    useEffect(() => {
        if (!marketId) {
            return;
        }

        if (market?.id === marketId) {
            return;
        }

        void loadMarket(marketId);
    }, [marketId, market?.id, loadMarket]);

    const marketData: MarketData | null = useMemo(() => {
        if (market?.id === marketId) {
            return market;
        }
        return null;
    }, [market, marketId]);

    const handleTrade = (amount: number) => {
        console.log("Trade executed:", amount, "for market:", marketId);
        // Future API integration point
    };

    if (marketLoading && !marketData) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-white text-lg">Loading market data...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!marketData) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-6">
                    <div className="text-white text-center">
                        <h1 className="text-2xl font-bold mb-4">Market Not Found</h1>
                        <p>The requested market could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl">
                            {getCategoryIcon(marketData.category)}
                        </div>
                        <h1 className="text-white text-2xl font-bold">{marketData.title}</h1>
                        <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </button>
                            <button className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {marketData.description && (
                        <p className="text-gray-400 mb-4">{marketData.description}</p>
                    )}
                    
                    {/* Prediction indicators */}
                    <div className="flex space-x-6 text-sm flex-wrap">
                        {marketData.outcomes.map((outcome, index) => (
                            <div key={outcome.id} className="flex items-center space-x-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-green-500' : 
                                    index === 1 ? 'bg-red-500' :
                                    index === 2 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}></div>
                                <span className="text-gray-400">{outcome.outcome} {outcome.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left column - Chart */}
                    <div className="xl:col-span-8">
                        <MarketChart data={marketData.chartData} className="mb-6" />
                        
                        {/* Outcomes section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-white text-lg font-semibold">OUTCOME</h2>
                                <h2 className="text-white text-lg font-semibold">% CHANGE</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {marketData.outcomes.map((outcome) => (
                                    <MarketOutcome
                                        key={outcome.id}
                                        outcomeId={outcome.id}
                                        outcome={outcome.outcome}
                                        percentage={outcome.percentage}
                                        volume={outcome.volume}
                                        change={outcome.change}
                                        yesPrice={outcome.yesPrice}
                                        noPrice={outcome.noPrice}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Trading & News */}
                    <div className="xl:col-span-4">
                        <TradingPanel onTrade={handleTrade} />
                    </div>
                </div>
            </div>
        </div>
    );
}