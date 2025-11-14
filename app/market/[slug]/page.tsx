"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Navbar from "../../../components/navbar";
import MarketChart from "../../../components/market-chart";
import MarketOutcome from "../../../components/market-outcome";
import TradingPanel from "../../../components/trading-panel";
import { getCategoryIcon } from "../../../lib/category";
import { useUiStore } from "../../../stores/ui-store";
import type { MarketData } from "../../../types/market-types";
import { DEFAULT_MARKET_ID } from "../../data/mock-markets";

export default function MarketDetailPage() {
    const params = useParams<{ slug?: string }>();
    const marketId = params?.slug ?? DEFAULT_MARKET_ID;

    const { market, marketLoading, loadMarket } = useUiStore((state) => ({
        market: state.market,
        marketLoading: state.marketLoading,
        loadMarket: state.loadMarket,
    }));

    useEffect(() => {
        if (!marketId || market?.id === marketId) {
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
                        <p>The requested market &ldquo;{marketId}&rdquo; could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-[var(--elevation-2)]">
                                {getCategoryIcon(marketData.category)}
                            </div>
                            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{marketData.title}</h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-auto">
                            <button className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] p-2.5 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.06)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </button>
                            <button className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] p-2.5 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.06)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {marketData.description && (
                        <p className="text-[var(--foreground-secondary)] mb-5 text-sm sm:text-base leading-relaxed">{marketData.description}</p>
                    )}

                    {/* Prediction indicators */}
                    <div className="flex flex-wrap gap-3 sm:gap-6 text-sm mb-5">
                        {marketData.outcomes.map((outcome, index) => (
                            <div key={outcome.id} className="flex items-center space-x-2.5 mb-2">
                                <div className={`w-3 h-3 rounded-full shrink-0 shadow-lg ${
                                    index === 0 ? 'bg-[var(--success)]' :
                                    index === 1 ? 'bg-[var(--danger)]' :
                                    index === 2 ? 'bg-[var(--primary)]' : 'bg-[var(--warning)]'
                                }`}></div>
                                <span className="text-[var(--foreground-secondary)] whitespace-nowrap font-medium">
                                    {outcome.outcome} <span className="text-white font-semibold">{outcome.percentage}%</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Market info */}
                    <div className="grid grid-cols-2 sm:flex sm:space-x-6 gap-3 text-sm text-[var(--foreground-secondary)]">
                        <span className="truncate"><span className="font-medium">Vol:</span> ${marketData.totalVolume.toLocaleString()}</span>
                        <span className="truncate"><span className="font-medium">Liq:</span> ${marketData.totalLiquidity.toLocaleString()}</span>
                        <span className="truncate"><span className="font-medium">Cat:</span> {marketData.category}</span>
                        <span className="truncate"><span className="font-medium">Ends:</span> {new Date(marketData.endDate).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left column - Chart */}
                    <div className="xl:col-span-8">
                        <MarketChart data={marketData.chartData} className="mb-6" />

                        {/* Outcomes section */}
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-white text-lg font-bold tracking-tight">OUTCOMES</h2>
                                <h2 className="text-[var(--foreground-secondary)] text-sm font-semibold hidden sm:block">% CHANGE</h2>
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
