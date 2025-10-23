import { Product, PriceVersion, MarginAnalytics, TrendDataPoint, ForecastSuggestion, RecentChange, Departure } from '../types';

// Use environment variable for API URL in production, fallback to local proxy in dev
const API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_URL}/api`;

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  // Products
  getProducts: () => fetchJSON<Product[]>(`${API_BASE}/products`),
  
  getProduct: (id: string) => fetchJSON<Product>(`${API_BASE}/products/${id}`),
  
  getProductVersions: (id: string) => fetchJSON<PriceVersion[]>(`${API_BASE}/products/${id}/versions`),

  // Pricing
  getPricingVersions: (params?: { productId?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJSON<PriceVersion[]>(`${API_BASE}/pricing/versions?${query}`);
  },

  // Analytics
  getMarginAnalytics: () => fetchJSON<MarginAnalytics>(`${API_BASE}/analytics/margins`),
  
  getTrends: (period: string = '12m') => fetchJSON<TrendDataPoint[]>(`${API_BASE}/analytics/trends?period=${period}`),
  
  getOutliers: () => fetchJSON<Product[]>(`${API_BASE}/analytics/outliers`),
  
  getRecentChanges: (limit: number = 20) => fetchJSON<RecentChange[]>(`${API_BASE}/analytics/recent-changes?limit=${limit}`),

  // Forecasting
  getForecast: (productId: string, season?: string) => {
    const query = season ? `?season=${encodeURIComponent(season)}` : '';
    return fetchJSON<ForecastSuggestion>(`${API_BASE}/forecast/${productId}${query}`);
  },
  
  getHistoricalPatterns: (productId: string) => fetchJSON<PriceVersion[]>(`${API_BASE}/forecast/patterns/${productId}`),

  // Departures
  getDepartures: (params?: { productId?: string; season?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJSON<Departure[]>(`${API_BASE}/departures?${query}`);
  },

  getDeparturesByProduct: (productId: string, season?: string) => {
    const query = season ? `?season=${encodeURIComponent(season)}` : '';
    return fetchJSON<Departure[]>(`${API_BASE}/departures/product/${productId}${query}`);
  },

  getDepartureById: (id: string) => fetchJSON<Departure>(`${API_BASE}/departures/${id}`),
};

