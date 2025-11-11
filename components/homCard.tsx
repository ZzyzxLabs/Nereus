"use client";

import Card from "./ui/Card";

interface HomCardProps {
    id?: string;
    title?: string;
    description?: string;
    value?: string;
    change?: number;
    marketType?: string;
}

export default function HomCard({
    id,
    title = "Market Asset",
    description = "Trading pair information",
    value = "$0.00",
    change = 0,
    marketType = "prediction"
}: HomCardProps) {
    const isPositive = change >= 0;
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return (
        <Card
            href={`/market/${slug}?type=${marketType}`}
            accent={isPositive ? "lime" : "magenta"}
            className="group relative overflow-hidden"
            padding="md"
        >
            {/* Glow gradient overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: "linear-gradient(140deg, rgba(0,245,255,0.10), rgba(255,31,143,0.10) 50%, rgba(123,255,91,0.08))"}} />

            <div className="relative space-y-3">
                <h3 className="font-semibold text-[15px] sm:text-[16px] neon-text-cyan tracking-wide leading-snug line-clamp-2">
                    {title}
                </h3>
            <p className="text-xs sm:text-sm text-foreground-dim line-clamp-2">
                    {description}
                </p>
                <div className="flex items-end justify-between pt-1">
                    <span className="text-[22px] font-bold text-white drop-shadow-sm">
                        {value}
                    </span>
                    <span className={`badge ${isPositive ? 'pos' : 'neg'}`}>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
                </div>
            </div>
        </Card>
    );
}