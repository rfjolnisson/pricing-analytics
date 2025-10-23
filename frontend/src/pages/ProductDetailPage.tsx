import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Product, PriceVersion } from '../types';
import { api } from '../utils/api';
import { formatCurrency, formatPercent, formatDate, getMarginColor } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;

      try {
        const [productData, versionsData] = await Promise.all([
          api.getProduct(productId),
          api.getProductVersions(productId),
        ]);

        setProduct(productData);
        setVersions(versionsData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-kaptio-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-kaptio-grey-300">Product not found</p>
        </div>
      </PageLayout>
    );
  }

  // Prepare component breakdown data
  const latestVersion = versions[0];
  const componentData = latestVersion?.components.map((comp) => ({
    name: comp.name,
    value: comp.isPercentage ? (latestVersion.basePrice * comp.value) / 100 : comp.value,
  })) || [];

  return (
    <PageLayout
      title={product.name}
      subtitle={`${product.code} • ${product.region} • ${product.duration} days`}
      actions={
        <Link
          to={`/forecasting?product=${productId}`}
          className="px-6 py-3 bg-kaptio-yellow-400 hover:bg-kaptio-yellow-300 text-kaptio-black font-bold rounded-lg shadow-button transition-all"
        >
          Get Forecast →
        </Link>
      }
    >
      {/* Product Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Current Price</div>
          <div className="text-2xl font-bold text-kaptio-primary-800">
            {formatCurrency(product.currentPrice)}
          </div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Current Margin</div>
          <div className={`text-2xl font-bold ${getMarginColor(product.currentMargin, product.targetMargin)}`}>
            {formatPercent(product.currentMargin)}
          </div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Target Margin</div>
          <div className="text-2xl font-bold text-kaptio-primary-800">
            {formatPercent(product.targetMargin)}
          </div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Cost Basis</div>
          <div className="text-2xl font-bold text-kaptio-primary-800">
            {formatCurrency(product.costBasis)}
          </div>
        </div>
      </div>

      {/* Component Breakdown Chart */}
      {componentData.length > 0 && (
        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6 mb-8">
          <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">Price Component Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={componentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="name" tick={{ fill: '#878787', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis tick={{ fill: '#878787', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #B4D4DA',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="value" fill="#056F82" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Price Version History */}
      <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
        <h3 className="text-lg font-bold text-kaptio-primary-800 mb-6">Price Change History</h3>
        
        <div className="space-y-4">
          {versions.slice(0, 15).map((version, index) => (
            <div
              key={version.id}
              className="border-l-4 border-kaptio-primary-200 pl-6 py-3 hover:bg-kaptio-primary-50 transition-colors rounded-r-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-bold text-kaptio-primary-800">
                      {formatDate(version.effectiveDate)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-kaptio-primary-100 text-kaptio-primary-800">
                      {version.reasonCode}
                    </span>
                    <span className="text-xs text-kaptio-grey-300">{version.season}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-kaptio-grey-300">Price: </span>
                      <span className="text-sm font-medium text-kaptio-primary-800">
                        {formatCurrency(version.basePrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-kaptio-grey-300">Margin: </span>
                      <span className="text-sm font-medium text-kaptio-primary-800">
                        {formatPercent(version.marginPercent)}
                      </span>
                    </div>
                    <div className="text-xs text-kaptio-grey-300">by {version.changedBy}</div>
                  </div>
                </div>
                {index > 0 && (
                  <div className="text-right">
                    <div className="text-xs text-kaptio-grey-300">vs previous</div>
                    <div className="text-sm font-medium text-kaptio-primary-800">
                      {((version.basePrice - versions[index - 1].basePrice) / versions[index - 1].basePrice * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

