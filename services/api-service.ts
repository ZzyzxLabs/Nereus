import {
    MarketData,
    ChartDataPoint,
    NewsItem,
    TradingOrder,
    UserPosition,
    ApiResponse,
    PaginatedResponse,
    MarketFilters,
    MarketApiService,
    TradingApiService
} from "../types/market-types";
import {
    DEFAULT_MARKET_ID,
    mockMarketCharts,
    mockMarketMap,
    mockMarketNews,
    mockMarkets
} from "../app/data/mock-markets";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class BaseApiService {
    protected async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error("API request failed:", error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            };
        }
    }
}

// Market API Service Implementation
export class MarketService extends BaseApiService implements MarketApiService {
    async getMarket(id: string): Promise<ApiResponse<MarketData>> {
        return this.request<MarketData>(`/markets/${id}`);
    }

    async getMarkets(filters?: MarketFilters): Promise<PaginatedResponse<MarketData>> {
        const queryParams = new URLSearchParams();
        
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const endpoint = `/markets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch markets:", error);
            return {
                success: false,
                data: [],
                pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
            };
        }
    }

    async getMarketChart(id: string, timeframe = '1D'): Promise<ApiResponse<ChartDataPoint[]>> {
        return this.request<ChartDataPoint[]>(`/markets/${id}/chart?timeframe=${timeframe}`);
    }

    async getRelatedNews(id: string): Promise<ApiResponse<NewsItem[]>> {
        return this.request<NewsItem[]>(`/markets/${id}/news`);
    }
}

// Trading API Service Implementation  
export class TradingService extends BaseApiService implements TradingApiService {
    async placeTrade(order: Partial<TradingOrder>): Promise<ApiResponse<TradingOrder>> {
        return this.request<TradingOrder>('/trades', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    async getUserPositions(userId: string): Promise<ApiResponse<UserPosition[]>> {
        return this.request<UserPosition[]>(`/users/${userId}/positions`);
    }

    async getUserOrders(userId: string): Promise<ApiResponse<TradingOrder[]>> {
        return this.request<TradingOrder[]>(`/users/${userId}/orders`);
    }

    async cancelOrder(orderId: string): Promise<ApiResponse<boolean>> {
        return this.request<boolean>(`/orders/${orderId}/cancel`, {
            method: 'DELETE',
        });
    }
}

// Mock data service for development
export class MockApiService implements MarketApiService, TradingApiService {
    async getMarket(id: string): Promise<ApiResponse<MarketData>> {
        // Simulate API delay
        await delay(250);

        const marketSource = mockMarketMap[id];
        if (!marketSource) {
            return { success: false, error: "Market not found" };
        }

        const market = clone(marketSource);
        if (!market.chartData && mockMarketCharts[marketSource.id]) {
            market.chartData = clone(mockMarketCharts[marketSource.id]);
        }

        return { success: true, data: market };
    }

    async getMarkets(filters?: MarketFilters): Promise<PaginatedResponse<MarketData>> {
        await delay(200);
        let data = mockMarkets;

        if (filters) {
            const { category, status, search, limit, offset } = filters;
            data = data.filter((market) => {
                if (category && market.category !== category) return false;
                if (status && market.status !== status) return false;
                if (search) {
                    const term = search.toLowerCase();
                    if (!market.title.toLowerCase().includes(term) &&
                        !(market.description ?? "").toLowerCase().includes(term)) {
                        return false;
                    }
                }
                return true;
            });

            if (typeof offset === "number" || typeof limit === "number") {
                const start = offset ?? 0;
                const end = typeof limit === "number" ? start + limit : undefined;
                data = data.slice(start, end);
            }
        }

        const cloned = data.map((market) => clone(market));
        return {
            success: true,
            data: cloned,
            pagination: {
                page: 1,
                limit: cloned.length,
                total: cloned.length,
                totalPages: 1
            }
        };
    }

    async getMarketChart(id: string, timeframe = "1D"): Promise<ApiResponse<ChartDataPoint[]>> {
        await delay(150);
        void timeframe; // timeframe used for API parity; mock returns full range
        const chart = mockMarketCharts[id] ?? mockMarketCharts[DEFAULT_MARKET_ID] ?? [];
        return { success: true, data: clone(chart) };
    }

    async getRelatedNews(id: string): Promise<ApiResponse<NewsItem[]>> {
        await delay(180);
        const news = mockMarketNews[id] ?? mockMarketNews[DEFAULT_MARKET_ID] ?? [];
        return { success: true, data: clone(news) };
    }

    async placeTrade(): Promise<ApiResponse<TradingOrder>> {
        await delay(400);
        return { success: true, message: "Trade executed successfully" };
    }

    async getUserPositions(): Promise<ApiResponse<UserPosition[]>> {
        return { success: true, data: [] };
    }

    async getUserOrders(): Promise<ApiResponse<TradingOrder[]>> {
        return { success: true, data: [] };
    }

    async cancelOrder(): Promise<ApiResponse<boolean>> {
        return { success: true, data: true };
    }
}

// Service instances
export const marketService = new MarketService();
export const tradingService = new TradingService();
export const mockApiService = new MockApiService();

export type ApiService = MarketApiService & TradingApiService;

// Use mock service in development, real service in production
export const apiService: ApiService = process.env.NODE_ENV === "development"
    ? mockApiService
    : ({ ...marketService, ...tradingService } as ApiService);