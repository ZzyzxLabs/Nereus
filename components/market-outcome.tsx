"use client";

import { useUiStore } from "../stores/ui-store";

interface MarketOutcomeProps {
    outcomeId?: string;
    outcome: string;
    percentage: number;
    volume: number;
    change: number;
    yesPrice: number;
    noPrice: number;
}

export default function MarketOutcome({
    outcomeId,
    outcome,
    percentage,
    volume,
    change,
    yesPrice,
    noPrice,
}: MarketOutcomeProps) {
    const isPositive = change >= 0;
    const setSelectedOutcomeId = useUiStore((s) => s.setSelectedOutcomeId);
    const setTradeSide = useUiStore((s) => s.setTradeSide);

    const chooseOutcome = () => {
        if (outcomeId) setSelectedOutcomeId(outcomeId);
        setTradeSide("buy");
    };

        return (
            <div className="card-surface p-4 border-l-4 border-slate-600">
            <div className="flex justify-between items-start mb-3 gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium text-sm mb-1 wrap-break-word">{outcome}</h3>
                    <p className="text-gray-400 text-xs">${volume.toLocaleString()}.{volume % 1000 === 0 ? "000" : ""} Vol</p>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-white text-lg sm:text-xl font-bold">{percentage}%</div>
                    <div className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}
                        {change}%
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 btn btn-success" onClick={chooseOutcome}>
                    Buy Yes {yesPrice.toFixed(1)}¢
                </button>
                <button className="flex-1 btn btn-danger" onClick={chooseOutcome}>
                    Buy No {noPrice.toFixed(1)}¢
                </button>
            </div>
        </div>
    );
}