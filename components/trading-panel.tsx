"use client";

import { useMemo } from "react";
import { useUiStore } from "../stores/ui-store";

interface TradingPanelProps {
    onTrade?: (amount: number) => void;
}

export default function TradingPanel({ onTrade }: TradingPanelProps) {
    const market = useUiStore((s) => s.market);
    const selectedOutcomeId = useUiStore((s) => s.selectedOutcomeId);
    const tradeSide = useUiStore((s) => s.tradeSide);
    const tradeAmount = useUiStore((s) => s.tradeAmount);
    const setTradeSide = useUiStore((s) => s.setTradeSide);
    const setTradeAmount = useUiStore((s) => s.setTradeAmount);

    const selectedOutcome = useMemo(() => {
        if (!market) return undefined;
        return (
            market.outcomes.find((o) => o.id === selectedOutcomeId) || market.outcomes[0]
        );
    }, [market, selectedOutcomeId]);

    const displayName = selectedOutcome?.outcome || "Select outcome";
    const currentPrice = selectedOutcome?.yesPrice ?? 2.5;

    const quickAmounts = [1, 20, 100];

    return (
        <div className="card-surface p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                        👴
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base truncate">{displayName}</span>
                </div>
                <button className="text-gray-400 hover:text-white p-1 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="flex flex-1">
                    <button
                        className={`flex-1 btn ${tradeSide === "buy" ? "btn-primary" : "btn-ghost"} rounded-l`}
                        onClick={() => setTradeSide("buy")}
                    >
                        Buy
                    </button>
                    <button
                        className={`flex-1 btn ${tradeSide === "sell" ? "btn-primary" : "btn-ghost"} rounded-r`}
                        onClick={() => setTradeSide("sell")}
                    >
                        Sell
                    </button>
                </div>
                <div className="flex items-center sm:ml-2">
                    <select className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm transition-colors">
                        <option>Market</option>
                        <option>Limit</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 btn btn-success">Yes {currentPrice}¢</button>
                    <button className="flex-1 btn btn-danger">
                        No {(100 - currentPrice * 40).toFixed(1)}¢
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">Amount</label>
                <div className="text-right mb-2">
                    <span className="text-white text-2xl sm:text-3xl font-bold">${tradeAmount}</span>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 mb-3">
                    {quickAmounts.map((amount) => (
                        <button
                            key={amount}
                            className="btn btn-outline"
                            onClick={() => setTradeAmount(tradeAmount + amount)}
                        >
                            +${amount}
                        </button>
                    ))}
                    <button
                        className="btn btn-outline col-span-2 sm:col-span-1"
                        onClick={() => setTradeAmount(1000)}
                    >
                        Max
                    </button>
                </div>
            </div>

            <button
                className="w-full btn btn-primary py-3 text-lg"
                onClick={() => onTrade?.(tradeAmount)}
            >
                Trade
            </button>

            <p className="text-gray-400 text-xs text-center mt-3">
                By trading, you agree to the <span className="underline cursor-pointer hover:text-gray-300">Terms of Use</span>
            </p>
        </div>
    );
}