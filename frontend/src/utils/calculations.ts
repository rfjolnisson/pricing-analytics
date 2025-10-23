import { Product, PriceVersion } from '../types';

export function calculateMargin(price: number, cost: number): number {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
}

export function calculateRevenueOpportunity(product: Product, estimatedBookings: number = 50): number {
  if (product.currentMargin >= product.targetMargin) return 0;
  
  const targetPrice = product.costBasis / (1 - (product.targetMargin / 100));
  const priceGap = targetPrice - product.currentPrice;
  
  return priceGap * estimatedBookings;
}

export function calculatePriceChange(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

export function groupByRegion(products: Product[]): Record<string, Product[]> {
  return products.reduce((acc, product) => {
    if (!acc[product.region]) {
      acc[product.region] = [];
    }
    acc[product.region].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
}

export function groupBySeason(versions: PriceVersion[]): Record<string, PriceVersion[]> {
  return versions.reduce((acc, version) => {
    if (!acc[version.season]) {
      acc[version.season] = [];
    }
    acc[version.season].push(version);
    return acc;
  }, {} as Record<string, PriceVersion[]>);
}

export function getAverageMarginForSeason(versions: PriceVersion[]): number {
  if (versions.length === 0) return 0;
  const total = versions.reduce((sum, v) => sum + v.marginPercent, 0);
  return total / versions.length;
}

export function detectPriceTrend(versions: PriceVersion[]): 'increasing' | 'decreasing' | 'stable' {
  if (versions.length < 2) return 'stable';
  
  const sorted = [...versions].sort((a, b) => 
    new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  );
  
  const firstPrice = sorted[0].basePrice;
  const lastPrice = sorted[sorted.length - 1].basePrice;
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
}

