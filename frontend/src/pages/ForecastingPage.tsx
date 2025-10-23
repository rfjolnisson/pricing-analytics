import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Product, ForecastSuggestion } from '../types';
import { api } from '../utils/api';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const seasons = [
  'Winter (Jan-Mar)',
  'Spring (Apr-Jun)',
  'Summer (Jul-Sep)',
  'Fall (Oct-Dec)',
];

export const ForecastingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [forecast, setForecast] = useState<ForecastSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
        
        // Check if product ID is in URL
        const productParam = searchParams.get('product');
        if (productParam && data.find(p => p.id === productParam)) {
          setSelectedProduct(productParam);
        } else if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleGenerateForecast = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const data = await api.getForecast(selectedProduct, selectedSeason || undefined);
      setForecast(data);
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const product = products.find((p) => p.id === selectedProduct);

  // Prepare historical data for chart
  const chartData = forecast?.historicalData.map((d) => ({
    year: d.year.toString(),
    price: d.price,
    margin: d.margin,
  })) || [];

  return (
    <PageLayout
      title="Pricing Forecasting Tool"
      subtitle="AI-powered pricing suggestions based on historical patterns"
    >
      {/* Input Section */}
      <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6 mb-8">
        <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">
          Configure Forecast Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
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
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-kaptio-primary-800 mb-3">
              Target Season (Optional)
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-kaptio-grey-200 rounded-lg focus:outline-none focus:border-kaptio-primary-400 font-medium"
            >
              <option value="">All Seasons</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateForecast}
              disabled={!selectedProduct || loading}
              className="w-full px-6 py-3 bg-kaptio-yellow-400 hover:bg-kaptio-yellow-300 disabled:bg-kaptio-grey-200 disabled:cursor-not-allowed text-kaptio-black font-bold rounded-lg shadow-button transition-all"
            >
              {loading ? 'Generating...' : 'Generate Forecast'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex items-center justify-center h-96 bg-kaptio-white rounded-lg shadow-kaptio">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-kaptio-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-kaptio-grey-300">Analyzing historical patterns...</p>
          </div>
        </div>
      ) : forecast ? (
        <>
          {/* Recommendation Card */}
          <div className="bg-gradient-to-br from-kaptio-primary-400 to-kaptio-primary-600 rounded-lg shadow-kaptio p-8 mb-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Suggested Pricing</h3>
                <p className="text-kaptio-primary-100">
                  Based on {forecast.historicalData.length} years of historical data
                </p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-kaptio-primary-100">Confidence</div>
                <div className="text-2xl font-bold">{forecast.confidence}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-kaptio-primary-100 mb-2">Suggested Price</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(forecast.suggestedPrice)}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-kaptio-primary-100 mb-2">Price Range</div>
                <div className="text-xl font-bold">
                  {formatCurrency(forecast.minPrice)} - {formatCurrency(forecast.maxPrice)}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-kaptio-primary-100 mb-2">Expected Margin</div>
                <div className="text-3xl font-bold">{formatPercent(forecast.expectedMargin)}</div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm font-bold text-kaptio-primary-100 mb-2">Analysis</div>
              <p className="text-white leading-relaxed">{forecast.reasoning}</p>
            </div>
          </div>

          {/* Historical Performance Chart */}
          <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6 mb-8">
            <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">
              Historical Pricing Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
                <XAxis dataKey="year" tick={{ fill: '#878787', fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#878787', fontSize: 12 }}
                  label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', fill: '#878787' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#878787', fontSize: 12 }}
                  label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#878787' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #B4D4DA',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={forecast.suggestedPrice}
                  stroke="#FFBC42"
                  strokeDasharray="5 5"
                  label={{ value: 'Suggested', fill: '#FFBC42' }}
                />
                <Bar yAxisId="left" dataKey="price" fill="#056F82" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="margin" fill="#69A9B4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison with Current Pricing */}
          {product && (
            <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
              <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">
                Impact Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-kaptio-grey-100 rounded-lg p-6">
                  <div className="text-sm text-kaptio-grey-300 mb-2">Current Pricing</div>
                  <div className="text-2xl font-bold text-kaptio-primary-800 mb-4">
                    {formatCurrency(product.currentPrice)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-kaptio-grey-300">Margin:</span>
                      <span className="font-medium">{formatPercent(product.currentMargin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kaptio-grey-300">vs Target:</span>
                      <span
                        className={
                          product.currentMargin >= product.targetMargin
                            ? 'text-green-600 font-medium'
                            : 'text-kaptio-action font-medium'
                        }
                      >
                        {(product.currentMargin - product.targetMargin).toFixed(1)}pp
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-kaptio-yellow-400 rounded-lg p-6 bg-kaptio-yellow-200/20">
                  <div className="text-sm text-kaptio-grey-300 mb-2">Suggested Pricing</div>
                  <div className="text-2xl font-bold text-kaptio-primary-800 mb-4">
                    {formatCurrency(forecast.suggestedPrice)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-kaptio-grey-300">Expected Margin:</span>
                      <span className="font-medium">{formatPercent(forecast.expectedMargin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kaptio-grey-300">Price Change:</span>
                      <span className="font-medium text-kaptio-primary-800">
                        {(((forecast.suggestedPrice - product.currentPrice) / product.currentPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-12 text-center">
          <div className="w-16 h-16 bg-kaptio-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-kaptio-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-kaptio-primary-800 mb-2">
            Ready to Generate a Forecast
          </h3>
          <p className="text-kaptio-grey-300">
            Select a product and optionally a season, then click "Generate Forecast" to see pricing recommendations
          </p>
        </div>
      )}
    </PageLayout>
  );
};

