import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { DepartureGrid } from '../components/departures/DepartureGrid';
import { Product, Departure } from '../types';
import { api } from '../utils/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const DeparturesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(false);

  const seasons = [
    'All Seasons',
    'Winter (Jan-Mar)',
    'Spring (Apr-Jun)',
    'Summer (Jul-Sep)',
    'Fall (Oct-Dec)',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
        
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

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchDepartures = async () => {
      setLoading(true);
      try {
        const season = selectedSeason === 'All Seasons' ? undefined : selectedSeason;
        const data = await api.getDeparturesByProduct(selectedProduct, season);
        setDepartures(data);
      } catch (error) {
        console.error('Error fetching departures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartures();
  }, [selectedProduct, selectedSeason]);

  // Calculate aggregate metrics
  const totalCapacity = departures.reduce((sum, d) => sum + d.capacity, 0);
  const totalBookings = departures.reduce((sum, d) => sum + d.bookings, 0);
  const avgOccupancy = totalCapacity > 0 ? (totalBookings / totalCapacity) * 100 : 0;
  const totalRevenue = departures.reduce((sum, d) => sum + (d.currentPrice * d.bookings), 0);
  const avgMargin = departures.length > 0
    ? departures.reduce((sum, d) => sum + d.marginPercent, 0) / departures.length
    : 0;

  const fastPaceDepartures = departures.filter(d => d.bookingPace === 'fast').length;
  const slowPaceDepartures = departures.filter(d => d.bookingPace === 'slow' || d.bookingPace === 'stalled').length;

  return (
    <PageLayout
      title="Departure Inventory"
      subtitle="Every departure is a mini-business. Optimize each one individually."
    >
      {/* Controls */}
      <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-kaptio-primary-800 mb-3">
              Filter by Season
            </label>
            <select
              value={selectedSeason || 'All Seasons'}
              onChange={(e) => setSelectedSeason(e.target.value === 'All Seasons' ? '' : e.target.value)}
              className="w-full px-4 py-3 border-2 border-kaptio-grey-200 rounded-lg focus:outline-none focus:border-kaptio-primary-400 font-medium"
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Total Departures</div>
          <div className="text-3xl font-bold text-kaptio-primary-800">{departures.length}</div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Total Capacity</div>
          <div className="text-3xl font-bold text-kaptio-primary-800">{totalCapacity}</div>
          <div className="text-xs text-kaptio-grey-300 mt-1">{totalBookings} booked</div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Avg Occupancy</div>
          <div className={`text-3xl font-bold ${avgOccupancy >= 75 ? 'text-green-600' : avgOccupancy >= 50 ? 'text-kaptio-primary-800' : 'text-kaptio-action'}`}>
            {formatPercent(avgOccupancy, 0)}
          </div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-kaptio-primary-800">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
          <div className="text-sm text-kaptio-grey-300 mb-2">Avg Margin</div>
          <div className="text-3xl font-bold text-kaptio-primary-800">
            {formatPercent(avgMargin)}
          </div>
        </div>
      </div>

      {/* Demand Signals */}
      {(fastPaceDepartures > 0 || slowPaceDepartures > 0) && (
        <div className="bg-gradient-to-r from-kaptio-primary-100 to-kaptio-primary-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-kaptio-primary-800 mb-4">🎯 Pricing Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fastPaceDepartures > 0 && (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="font-bold text-kaptio-primary-800 mb-1">
                      {fastPaceDepartures} High-Demand Departures
                    </div>
                    <div className="text-sm text-kaptio-grey-300">
                      These departures are filling faster than average. Consider raising prices by 5-10% for remaining capacity.
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {slowPaceDepartures > 0 && (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <div className="font-bold text-kaptio-primary-800 mb-1">
                      {slowPaceDepartures} Slow-Booking Departures
                    </div>
                    <div className="text-sm text-kaptio-grey-300">
                      These departures need promotional support. Consider early-booking discounts or flash sales.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Departure Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96 bg-kaptio-white rounded-lg shadow-kaptio">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-kaptio-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-kaptio-grey-300">Loading departures...</p>
          </div>
        </div>
      ) : (
        <DepartureGrid departures={departures} />
      )}
    </PageLayout>
  );
};

