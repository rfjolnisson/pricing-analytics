import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { KPICard } from '../components/dashboard/KPICard';
import { MarginTrendChart } from '../components/dashboard/MarginTrendChart';
import { ProductTable } from '../components/dashboard/ProductTable';
import { RecentChangesTable } from '../components/dashboard/RecentChangesTable';
import { api } from '../utils/api';
import { MarginAnalytics, TrendDataPoint, Product, RecentChange } from '../types';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<MarginAnalytics | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentChanges, setRecentChanges] = useState<RecentChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, trendsData, productsData, changesData] = await Promise.all([
          api.getMarginAnalytics(),
          api.getTrends('12m'),
          api.getProducts(),
          api.getRecentChanges(20),
        ]);

        setAnalytics(analyticsData);
        setTrends(trendsData);
        setProducts(productsData);
        setRecentChanges(changesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-kaptio-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-kaptio-grey-300">Loading dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Pricing Intelligence Dashboard"
      subtitle="Monitor margin performance and pricing trends across your portfolio"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Average Margin"
          value={analytics?.averageMargin || 0}
          format="percent"
          delta={analytics?.yoyDelta}
          deltaLabel="vs last year"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />

        <KPICard
          title="Total Price Changes"
          value="142"
          deltaLabel="last 90 days"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <KPICard
          title="Below Target Margin"
          value={analytics?.belowTarget || 0}
          alert={analytics ? analytics.belowTarget > 5 : undefined}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />

        <KPICard
          title="Revenue Opportunity"
          value={formatCurrency(analytics?.revenueOpportunity || 0)}
          deltaLabel="potential gain"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Margin Trend Chart */}
      <div className="mb-8">
        <MarginTrendChart data={trends} targetMargin={28} />
      </div>

      {/* Product Table */}
      <div className="mb-8">
        <ProductTable products={products} maxRows={10} />
      </div>

      {/* Recent Changes */}
      <RecentChangesTable changes={recentChanges} />
    </PageLayout>
  );
};

