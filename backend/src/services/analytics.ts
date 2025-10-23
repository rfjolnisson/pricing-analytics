import { DataStore } from './dataStore';
import { MarginAnalytics, TrendDataPoint, Product, PriceVersion } from '../types';
import { subMonths, format, startOfMonth, eachMonthOfInterval } from 'date-fns';

export class AnalyticsService {
  private dataStore: DataStore;

  constructor() {
    this.dataStore = new DataStore();
  }

  getMarginAnalytics(): MarginAnalytics {
    const products = this.dataStore.getAllProducts();
    const versions = this.dataStore.getAllPricingVersions();

    // Calculate average margin across all products
    const totalMargin = products.reduce((sum, p) => sum + p.currentMargin, 0);
    const averageMargin = totalMargin / products.length;

    // Calculate YoY delta (compare current margins to 1 year ago)
    const oneYearAgo = subMonths(new Date(), 12);
    const historicalMargins = products.map(product => {
      const historicalVersions = versions
        .filter(v => v.productId === product.id && new Date(v.effectiveDate) <= oneYearAgo)
        .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
      
      return historicalVersions.length > 0 ? historicalVersions[0].marginPercent : product.currentMargin;
    });

    const avgHistoricalMargin = historicalMargins.reduce((sum, m) => sum + m, 0) / historicalMargins.length;
    const yoyDelta = averageMargin - avgHistoricalMargin;

    // Products below target margin
    const belowTarget = products.filter(p => p.currentMargin < p.targetMargin).length;

    // Revenue opportunity calculation
    const revenueOpportunity = products.reduce((sum, product) => {
      if (product.currentMargin < product.targetMargin) {
        // Calculate what price would achieve target margin
        const currentRevenue = product.currentPrice;
        const targetPrice = product.costBasis / (1 - (product.targetMargin / 100));
        const opportunity = targetPrice - product.currentPrice;
        // Assume 50 bookings per year average
        return sum + (opportunity * 50);
      }
      return sum;
    }, 0);

    return {
      averageMargin: Math.round(averageMargin * 10) / 10,
      yoyDelta: Math.round(yoyDelta * 10) / 10,
      totalProducts: products.length,
      belowTarget,
      revenueOpportunity: Math.round(revenueOpportunity)
    };
  }

  getTrendData(period: string = '12m'): TrendDataPoint[] {
    const months = period === '12m' ? 12 : period === '6m' ? 6 : 3;
    const versions = this.dataStore.getAllPricingVersions();
    const products = this.dataStore.getAllProducts();

    const endDate = new Date();
    const startDate = subMonths(endDate, months);

    // Generate data points for each month
    const monthlyData: TrendDataPoint[] = [];
    const monthRanges = eachMonthOfInterval({ start: startDate, end: endDate });

    monthRanges.forEach(monthStart => {
      const monthEnd = startOfMonth(subMonths(monthStart, -1));
      const monthStr = format(monthStart, 'MMM yyyy');

      // Get price changes in this month
      const priceChanges = versions.filter(v => {
        const vDate = new Date(v.effectiveDate);
        return vDate >= monthStart && vDate < monthEnd;
      }).length;

      // Calculate average margin for this month
      // For each product, find the active price at this time
      let totalMargin = 0;
      products.forEach(product => {
        const activeVersion = versions
          .filter(v => v.productId === product.id && new Date(v.effectiveDate) <= monthStart)
          .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())[0];
        
        if (activeVersion) {
          totalMargin += activeVersion.marginPercent;
        } else {
          totalMargin += product.currentMargin;
        }
      });

      const avgMargin = totalMargin / products.length;

      monthlyData.push({
        date: monthStr,
        margin: Math.round(avgMargin * 10) / 10,
        priceChanges
      });
    });

    return monthlyData;
  }

  getOutliers(): Product[] {
    const products = this.dataStore.getAllProducts();
    
    // Products with margin 5+ percentage points below target
    return products
      .filter(p => (p.targetMargin - p.currentMargin) >= 5)
      .sort((a, b) => (b.targetMargin - b.currentMargin) - (a.targetMargin - a.currentMargin));
  }

  getRecentChanges(limit: number = 20): Array<PriceVersion & { productName: string }> {
    const versions = this.dataStore.getAllPricingVersions();
    const products = this.dataStore.getAllProducts();

    return versions
      .slice(0, limit)
      .map(version => {
        const product = products.find(p => p.id === version.productId);
        return {
          ...version,
          productName: product?.name || 'Unknown Product'
        };
      });
  }
}

