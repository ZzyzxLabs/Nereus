"use client"

import { useEffect } from "react"
import { CategoryTabs } from "./category-tabs"
import { MarketCard, MarketCardGrid, MarketCardSmall } from "./market/market-card"
import { storeStore, type Market } from "@/store/storeStore"
// Importing Sidebar (Assuming path is correct or relative to this file)
import { MarketDetailSidebar } from "./sneakpeek/peekCard" 

export function MarketGrid() {
  // 1. Use setSelectedMarket from Store
  const { marketList, queryMarkets, setSelectedMarket } = storeStore()
  
  useEffect(() => {
    queryMarkets()
  }, [queryMarkets])

  // 2. Update Global Store on click, Sidebar detects change
  const handleMarketClick = (market: Market, side?: "yes" | "no") => {
    setSelectedMarket(market)
    console.log('Market clicked:', market.topic, side)
  }

  if (marketList.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4">
        <CategoryTabs>
          {() => (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading markets...</p>
            </div>
          )}
        </CategoryTabs>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 relative">
      {/* 3. Sidebar Component (Hidden by default, slides in) */}
      <MarketDetailSidebar />

      <CategoryTabs>
        {() => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Large Card - Expanded to col-span-8 for better sparkline visibility */}
            {marketList[0] && (
              <div className="md:col-span-8">
                <MarketCard m={marketList[0]} onMarketClick={handleMarketClick} />
              </div>
            )}
            
            {/* Medium Cards - Expanded to col-span-4 (was 3) to fix button disappearance */}
            {marketList[1] && (
              <div className="md:col-span-4">
                <MarketCardGrid m={marketList[1]} onMarketClick={handleMarketClick} />
              </div>
            )}
            
            {/* Second Medium Card starts the second row efficiently if needed */}
            {marketList[2] && (
              <div className="md:col-span-4">
                <MarketCardGrid m={marketList[2]} onMarketClick={handleMarketClick} />
              </div>
            )}

            {/* Small Cards - Expanded to col-span-4 to match the grid rhythm */}
            {marketList.slice(3, 6).map((market) => (
              <div key={market.address} className="md:col-span-4">
                <MarketCardSmall m={market} onMarketClick={handleMarketClick} />
              </div>
            ))}
            
            <div className="md:col-span-12">
              <div className="h-12" /> {/* Spacer for footer */}
            </div>
          </div>
        )}
      </CategoryTabs>
    </section>
  )
}