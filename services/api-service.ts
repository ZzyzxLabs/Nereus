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
} from '../types/market-types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
            console.error('API request failed:', error);
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
            console.error('Failed to fetch markets:', error);
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockMarket: MarketData = {
            id,
            title: "Fed decision in December?",
            description: "What will the Federal Reserve decide regarding interest rates in December?",
            category: "Economics",
            status: "active",
            endDate: "2025-12-31T23:59:59Z",
            totalVolume: 150000,
            totalLiquidity: 75000,
            outcomes: [
                {
                    id: "50bps-decrease",
                    outcome: "50+ bps decrease",
                    percentage: 2,
                    volume: 9066,
                    change: 2,
                    yesPrice: 2.5,
                    noPrice: 97.6
                },
                {
                    id: "25bps-decrease",
                    outcome: "25 bps decrease", 
                    percentage: 71,
                    volume: 6356,
                    change: -2,
                    yesPrice: 71,
                    noPrice: 30
                },
                {
                    id: "no-change",
                    outcome: "No change",
                    percentage: 27, 
                    volume: 5098,
                    change: 2,
                    yesPrice: 27,
                    noPrice: 74
                },
                {
                    id: "25bps-increase",
                    outcome: "25+ bps increase",
                    percentage: 1,
                    volume: 47035,
                    change: 0,
                    yesPrice: 0.6,
                    noPrice: 99.5
                }
            ],
            tags: ["fed", "interest-rates", "economics"],
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: new Date().toISOString()
        };

        return { success: true, data: mockMarket };
    }

    async getMarkets(): Promise<PaginatedResponse<MarketData>> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            success: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        };
    }

    async getMarketChart(): Promise<ApiResponse<ChartDataPoint[]>> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const mockData: ChartDataPoint[] = [
            { timestamp: Date.now() - 86400000 * 30, time: "Sep", yes: 60, no: 40 },
            { timestamp: Date.now() - 86400000 * 15, time: "Oct", yes: 65, no: 35 },
            { timestamp: Date.now(), time: "Nov", yes: 80, no: 20 },
        ];
        return { success: true, data: mockData };
    }

    async getRelatedNews(): Promise<ApiResponse<NewsItem[]>> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockNews: NewsItem[] = [
            {
                id: "1",
                title: "Fed rate hike in 2025?",
                author: "Market Analyst", 
                avatar: "👴",
                percentage: 1,
                category: "Fed Rates",
                publishedAt: new Date().toISOString()
            }
        ];
        return { success: true, data: mockNews };
    }

    async placeTrade(): Promise<ApiResponse<TradingOrder>> {
        await new Promise(resolve => setTimeout(resolve, 1000));
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

// Use mock service in development, real service in production
export const apiService = process.env.NODE_ENV === 'development' 
    ? mockApiService 
    : { ...marketService, ...tradingService };