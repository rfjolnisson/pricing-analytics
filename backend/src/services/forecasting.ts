import { DataStore } from './dataStore';
import { ForecastSuggestion, PriceVersion } from '../types';

export class ForecastingService {
  private dataStore: DataStore;

  constructor() {
    this.dataStore = new DataStore();
  }

  getForecast(productId: string, targetSeason?: string): ForecastSuggestion | null {
    const product = this.dataStore.getProductById(productId);
    if (!product) return null;

    const versions = this.dataStore.getPricingVersionsByProduct(productId);
    
    // Filter by season if specified
    const seasonVersions = targetSeason
      ? versions.filter(v => v.season === targetSeason)
      : versions;

    if (seasonVersions.length === 0) {
      return null;
    }

    // Group by year to get historical patterns
    const historicalByYear = new Map<number, PriceVersion>();
    seasonVersions.forEach(version => {
      const year = new Date(version.effectiveDate).getFullYear();
      if (!historicalByYear.has(year)) {
        historicalByYear.set(year, version);
      }
    });

    const historicalData = Array.from(historicalByYear.entries())
      .map(([year, version]) => ({
        year,
        price: version.basePrice,
        margin: version.marginPercent
      }))
      .sort((a, b) => b.year - a.year)
      .slice(0, 3); // Last 3 years

    if (historicalData.length === 0) {
      return null;
    }

    // Calculate average and trend
    const avgPrice = historicalData.reduce((sum, d) => sum + d.price, 0) / historicalData.length;
    const avgMargin = historicalData.reduce((sum, d) => sum + d.margin, 0) / historicalData.length;

    // Detect trend (linear regression on recent years)
    let trend = 0;
    if (historicalData.length >= 2) {
      const priceChange = historicalData[0].price - historicalData[historicalData.length - 1].price;
      const yearSpan = historicalData[0].year - historicalData[historicalData.length - 1].year;
      trend = priceChange / yearSpan;
    }

    // Calculate suggested price with trend adjustment
    const suggestedPrice = Math.round(avgPrice + trend);
    const minPrice = Math.round(suggestedPrice * 0.90);
    const maxPrice = Math.round(suggestedPrice * 1.10);

    // Expected margin based on cost basis
    const expectedMargin = ((suggestedPrice - product.costBasis) / suggestedPrice) * 100;

    // Confidence score based on data consistency
    const priceVariance = historicalData.reduce((sum, d) => {
      return sum + Math.abs(d.price - avgPrice);
    }, 0) / historicalData.length;
    const coefficientOfVariation = priceVariance / avgPrice;
    const confidence = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));

    // Generate reasoning
    let reasoning = `Based on ${historicalData.length} year(s) of data, `;
    if (trend > 0) {
      reasoning += `prices have been trending upward by $${Math.round(trend)}/year. `;
    } else if (trend < 0) {
      reasoning += `prices have been trending downward by $${Math.round(Math.abs(trend))}/year. `;
    } else {
      reasoning += `prices have remained stable. `;
    }

    if (expectedMargin >= product.targetMargin) {
      reasoning += `This pricing achieves your target margin of ${product.targetMargin}%.`;
    } else {
      reasoning += `Note: This pricing falls short of your ${product.targetMargin}% target margin by ${Math.round(product.targetMargin - expectedMargin)}%.`;
    }

    return {
      productId,
      season: targetSeason || 'All Seasons',
      suggestedPrice,
      minPrice,
      maxPrice,
      expectedMargin: Math.round(expectedMargin * 10) / 10,
      confidence: Math.round(confidence),
      reasoning,
      historicalData
    };
  }

  getHistoricalPatterns(productId: string): PriceVersion[] {
    return this.dataStore.getPricingVersionsByProduct(productId);
  }
}

