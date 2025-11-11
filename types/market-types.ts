// API Interface types for future integration

export interface MarketOutcome {
    id: string;
    outcome: string;
    percentage: number;
    volume: number;
    change: number;
    yesPrice: number;
    noPrice: number;
    liquidity?: number;
    totalShares?: number;
}

export interface ChartDataPoint {
    timestamp: string | number;
    time?: string;
    yes: number;
    no: number;
    volume?: number;
}

export interface MarketData {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: 'active' | 'resolved' | 'paused';
    endDate: string;
    totalVolume: number;
    totalLiquidity: number;
    outcomes: MarketOutcome[];
    chartData?: ChartDataPoint[];
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface NewsItem {
    id: string;
    title: string;
    author: string;
    avatar: string;
    percentage: number;
    category: string;
    url?: string;
    publishedAt: string;
    relevanceScore?: number;
}

export interface TradingOrder {
    id: string;
    marketId: string;
    outcomeId: string;
    side: 'yes' | 'no';
    type: 'market' | 'limit';
    amount: number;
    price?: number;
    status: 'pending' | 'filled' | 'cancelled';
    userId: string;
    createdAt: string;
}

export interface UserPosition {
    id: string;
    marketId: string;
    outcomeId: string;
    side: 'yes' | 'no';
    shares: number;
    averagePrice: number;
    currentValue: number;
    unrealizedPnL: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// API Service interfaces
export interface MarketApiService {
    getMarket(id: string): Promise<ApiResponse<MarketData>>;
    getMarkets(filters?: MarketFilters): Promise<PaginatedResponse<MarketData>>;
    getMarketChart(id: string, timeframe?: string): Promise<ApiResponse<ChartDataPoint[]>>;
    getRelatedNews(id: string): Promise<ApiResponse<NewsItem[]>>;
}

export interface TradingApiService {
    placeTrade(order: Partial<TradingOrder>): Promise<ApiResponse<TradingOrder>>;
    getUserPositions(userId: string): Promise<ApiResponse<UserPosition[]>>;
    getUserOrders(userId: string): Promise<ApiResponse<TradingOrder[]>>;
    cancelOrder(orderId: string): Promise<ApiResponse<boolean>>;
}

export interface MarketFilters {
    category?: string;
    status?: MarketData['status'];
    search?: string;
    sortBy?: 'volume' | 'liquidity' | 'endDate' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

// Websocket event types for real-time updates
export interface WebSocketEvent {
    type: 'market_update' | 'price_update' | 'trade_executed' | 'order_update';
    data: Record<string, unknown>;
    timestamp: string;
}

export interface MarketUpdateEvent extends WebSocketEvent {
    type: 'market_update';
    data: {
        marketId: string;
        outcomes: MarketOutcome[];
        volume: number;
        liquidity: number;
    };
}

export interface PriceUpdateEvent extends WebSocketEvent {
    type: 'price_update';
    data: {
        marketId: string;
        outcomeId: string;
        yesPrice: number;
        noPrice: number;
        timestamp: string;
    };
}