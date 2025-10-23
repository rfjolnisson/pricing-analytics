import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Product, PriceVersion } from '../types';
import { api } from '../utils/api';
import { formatCurrency, formatPercent, getDeltaColor, getDeltaBgColor } from '../utils/formatters';
import { groupBySeason } from '../utils/calculations';

export const ComparisonPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchVersions = async () => {
      setLoading(true);
      try {
        const data = await api.getProductVersions(selectedProduct);
        setVersions(data);
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [selectedProduct]);

  const seasonGroups = groupBySeason(versions);
  const seasons = Object.keys(seasonGroups);
  const product = products.find((p) => p.id === selectedProduct);

  // Get most recent version for each season
  const seasonalComparison = seasons.map((season) => {
    const seasonVersions = seasonGroups[season];
    const recent = seasonVersions[0];
    return {
      season,
      price: recent.basePrice,
      margin: recent.marginPercent,
      lastUpdated: recent.effectiveDate,
      count: seasonVersions.length,
    };
  });

  return (
    <PageLayout
      title="Season-over-Season Comparison"
      subtitle="Compare pricing and margins across different seasons"
    >
      {/* Product Selector */}
      <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6 mb-8">
        <label className="block text-sm font-bold text-kaptio-primary-800 mb-3">
          Select Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-4 py-3 border-2 border-kaptio-grey-200 rounded-lg focus:outline-none focus:border-kaptio-primary-400 font-medium"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.code})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-kaptio-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Seasonal Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {seasonalComparison.map((season, index) => {
              const prevSeason = index > 0 ? seasonalComparison[index - 1] : null;
              const priceDelta = prevSeason
                ? ((season.price - prevSeason.price) / prevSeason.price) * 100
                : 0;
              const marginDelta = prevSeason ? season.margin - prevSeason.margin : 0;

              return (
                <div
                  key={season.season}
                  className="bg-kaptio-white rounded-lg shadow-kaptio p-6 border-2 border-kaptio-grey-100 hover:border-kaptio-primary-400 transition-all"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-kaptio-primary-800 uppercase">
                      {season.season}
                    </h3>
                    <p className="text-xs text-kaptio-grey-300 mt-1">
                      {season.count} price changes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-kaptio-grey-300 mb-1">Price</div>
                      <div className="text-2xl font-bold text-kaptio-primary-800">
                        {formatCurrency(season.price)}
                      </div>
                      {prevSeason && (
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDeltaBgColor(
                              priceDelta
                            )} ${getDeltaColor(priceDelta)}`}
                          >
                            {priceDelta > 0 ? '↑' : '↓'} {Math.abs(priceDelta).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-kaptio-grey-300 mb-1">Margin</div>
                      <div className="text-xl font-bold text-kaptio-primary-800">
                        {formatPercent(season.margin)}
                      </div>
                      {prevSeason && (
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDeltaBgColor(
                              marginDelta
                            )} ${getDeltaColor(marginDelta)}`}
                          >
                            {marginDelta > 0 ? '↑' : '↓'} {Math.abs(marginDelta).toFixed(1)}pp
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
            <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">
              Detailed Seasonal Analysis
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-kaptio-grey-100">
                    <th className="text-left py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      Season
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      Base Price
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      Margin %
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      Cost Basis
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      vs Target
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-kaptio-primary-800">
                      Updates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seasonalComparison.map((season) => {
                    const targetDelta = season.margin - (product?.targetMargin || 28);

                    return (
                      <tr
                        key={season.season}
                        className="border-b border-kaptio-grey-100 hover:bg-kaptio-primary-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-kaptio-primary-800">
                          {season.season}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-kaptio-primary-800">
                          {formatCurrency(season.price)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-bold text-kaptio-primary-800">
                            {formatPercent(season.margin)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-kaptio-grey-300">
                          {formatCurrency(product?.costBasis || 0)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDeltaBgColor(
                              targetDelta
                            )} ${getDeltaColor(targetDelta)}`}
                          >
                            {targetDelta > 0 ? '+' : ''}
                            {targetDelta.toFixed(1)}pp
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-kaptio-grey-300">
                          {season.count} changes
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
};

