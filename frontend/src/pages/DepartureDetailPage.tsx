import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Departure, Product } from '../types';
import { api } from '../utils/api';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export const DepartureDetailPage: React.FC = () => {
  const { departureId } = useParams<{ departureId: string }>();
  const navigate = useNavigate();
  const [departure, setDeparture] = useState<Departure | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!departureId) return;
      
      try {
        const departureData = await api.getDepartureById(departureId);
        setDeparture(departureData);
        
        // Fetch product details
        const productData = await api.getProduct(departureData.productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching departure details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [departureId]);

  if (loading) {
    return (
      <PageLayout title="Loading..." subtitle="Fetching departure details">
        <div className="flex items-center justify-center h-64">
          <div className="text-kaptio-grey-300">Loading departure details...</div>
        </div>
      </PageLayout>
    );
  }

  if (!departure || !product) {
    return (
      <PageLayout title="Not Found" subtitle="Departure not found">
        <div className="bg-kaptio-white rounded-lg shadow-kaptio p-8 text-center">
          <p className="text-kaptio-grey-300 mb-4">The requested departure could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-kaptio-primary-400 text-white rounded-lg hover:bg-kaptio-primary-500"
          >
            Back to Departures
          </button>
        </div>
      </PageLayout>
    );
  }

  // Get status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold_out': return 'bg-kaptio-action text-white';
      case 'nearly_full': return 'bg-kaptio-yellow-400 text-kaptio-black';
      case 'cancelled': return 'bg-kaptio-grey-200 text-kaptio-grey-300';
      default: return 'bg-kaptio-primary-100 text-kaptio-primary-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sold_out': return 'Sold Out';
      case 'nearly_full': return 'Nearly Full';
      case 'cancelled': return 'Cancelled';
      default: return 'Open';
    }
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'fast': return 'text-green-600 bg-green-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'slow': return 'text-yellow-600 bg-yellow-100';
      case 'stalled': return 'text-red-600 bg-red-100';
      default: return 'text-kaptio-grey-300 bg-kaptio-grey-100';
    }
  };

  const getPaceLabel = (pace: string) => {
    switch (pace) {
      case 'fast': return 'Fast 🔥';
      case 'normal': return 'Normal';
      case 'slow': return 'Slow';
      case 'stalled': return 'Stalled ⚠️';
      default: return 'Unknown';
    }
  };

  // Calculate metrics
  const revenue = departure.currentPrice * departure.bookings;
  const potentialRevenue = departure.currentPrice * departure.capacity;
  const availableSeats = departure.capacity - departure.bookings;

  // Generate booking timeline data (mock for visualization)
  const generateBookingTimeline = () => {
    const totalDays = 180; // Typical booking window
    const daysPassed = totalDays - departure.daysUntilDeparture;
    const points = [];
    
    for (let i = 0; i <= daysPassed; i += 10) {
      const progress = i / daysPassed;
      // Simulate S-curve booking pattern
      const bookings = Math.floor(departure.bookings * (1 / (1 + Math.exp(-10 * (progress - 0.5)))));
      points.push({
        day: i,
        bookings: bookings,
        daysFromDeparture: totalDays - i
      });
    }
    
    return points;
  };

  const timelineData = generateBookingTimeline();

  // Generate recommendations
  const getRecommendation = () => {
    if (departure.status === 'cancelled') {
      return {
        type: 'info',
        title: 'Departure Cancelled',
        message: 'This departure has been cancelled. Historical data is shown for reference only.',
        actions: []
      };
    }

    if (departure.status === 'sold_out') {
      return {
        type: 'success',
        title: 'Sold Out! 🎉',
        message: 'This departure is fully booked. Consider adding an additional departure for this date range.',
        actions: [
          { label: 'View Similar Departures', type: 'secondary' },
          { label: 'Add New Departure', type: 'primary' }
        ]
      };
    }

    if (departure.bookingPace === 'fast' && departure.occupancyRate > 80 && departure.daysUntilDeparture > 30) {
      const suggestedIncrease = Math.round(departure.currentPrice * 0.10);
      const newPrice = departure.currentPrice + suggestedIncrease;
      return {
        type: 'opportunity',
        title: 'Pricing Opportunity 💰',
        message: `This departure is filling fast (${departure.occupancyRate.toFixed(0)}% booked with ${departure.daysUntilDeparture} days to go). You can likely raise the price.`,
        recommendation: `Suggested action: Raise price by ${formatCurrency(suggestedIncrease)} to ${formatCurrency(newPrice)}`,
        impact: `Potential additional revenue: ${formatCurrency(suggestedIncrease * availableSeats)}`,
        actions: [
          { label: 'Apply Price Increase', type: 'primary' },
          { label: 'View Pricing History', type: 'secondary' }
        ]
      };
    }

    if ((departure.bookingPace === 'slow' || departure.bookingPace === 'stalled') && 
        departure.occupancyRate < 40 && 
        departure.daysUntilDeparture < 90) {
      const cancelDeadline = Math.max(60, departure.daysUntilDeparture - 30);
      const promotionDiscount = Math.round(departure.currentPrice * 0.10);
      
      return {
        type: 'warning',
        title: 'At-Risk Departure ⚠️',
        message: `Only ${departure.occupancyRate.toFixed(0)}% booked with ${departure.daysUntilDeparture} days remaining. Action needed.`,
        options: [
          {
            title: 'Option A: Promote Now',
            details: `Offer 10% early booking discount (${formatCurrency(departure.currentPrice - promotionDiscount)})`,
            impact: `Expected: 4-6 additional bookings, net revenue: +${formatCurrency((departure.currentPrice - promotionDiscount) * 5 - (promotionDiscount * departure.bookings))}`
          },
          {
            title: 'Option B: Cancel Early',
            details: `Cancel by day ${cancelDeadline} to avoid sunk costs`,
            impact: `Saves: $15,000-25,000 in operational costs, refund ${departure.bookings} guests`
          }
        ],
        actions: [
          { label: 'Create Promotion', type: 'primary' },
          { label: 'Review Cancellation Policy', type: 'secondary' }
        ]
      };
    }

    if (departure.occupancyRate > 90) {
      return {
        type: 'success',
        title: 'Well Done! ✨',
        message: `This departure is nearly full (${departure.occupancyRate.toFixed(0)}% booked). Great work!`,
        recommendation: 'Consider this pricing strategy for similar future departures.',
        actions: [
          { label: 'Clone Pricing Strategy', type: 'primary' }
        ]
      };
    }

    return {
      type: 'normal',
      title: 'On Track',
      message: `This departure is booking normally (${departure.occupancyRate.toFixed(0)}% booked with ${departure.daysUntilDeparture} days to go).`,
      recommendation: 'Continue monitoring booking pace. No action needed at this time.',
      actions: []
    };
  };

  const recommendation = getRecommendation();

  return (
    <PageLayout
      title={`${product.name}`}
      subtitle={`Departure: ${formatDate(departure.departureDate)}`}
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-kaptio-primary-400 hover:text-kaptio-primary-500 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Departures
        </button>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-kaptio-primary-400 to-kaptio-primary-500 rounded-lg shadow-kaptio p-8 mb-8 text-white"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">{formatDate(departure.departureDate)}</h2>
            <p className="text-kaptio-primary-100 mb-4">{departure.season} • {product.duration} days</p>
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(departure.status)}`}>
                {getStatusLabel(departure.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaceColor(departure.bookingPace)}`}>
                {getPaceLabel(departure.bookingPace)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{formatCurrency(departure.currentPrice)}</div>
            <div className="text-kaptio-primary-100 text-sm mt-1">per person</div>
            <div className="text-kaptio-primary-100 text-sm">Margin: {formatPercent(departure.marginPercent)}</div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
        >
          <div className="text-kaptio-grey-300 text-sm mb-2">Occupancy Rate</div>
          <div className="text-3xl font-bold text-kaptio-primary-800 mb-2">
            {formatPercent(departure.occupancyRate)}
          </div>
          <div className="text-sm text-kaptio-grey-300">
            {departure.bookings} / {departure.capacity} booked
          </div>
          <div className="mt-3 bg-kaptio-grey-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-kaptio-primary-400 h-full transition-all"
              style={{ width: `${departure.occupancyRate}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
        >
          <div className="text-kaptio-grey-300 text-sm mb-2">Revenue Booked</div>
          <div className="text-3xl font-bold text-kaptio-primary-800 mb-2">
            {formatCurrency(revenue)}
          </div>
          <div className="text-sm text-kaptio-grey-300">
            of {formatCurrency(potentialRevenue)} potential
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
        >
          <div className="text-kaptio-grey-300 text-sm mb-2">Days Until Departure</div>
          <div className="text-3xl font-bold text-kaptio-primary-800 mb-2">
            {departure.daysUntilDeparture}
          </div>
          <div className="text-sm text-kaptio-grey-300">
            Opened: {formatDate(departure.openedForBookingDate)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
        >
          <div className="text-kaptio-grey-300 text-sm mb-2">Booking Velocity</div>
          <div className="text-3xl font-bold text-kaptio-primary-800 mb-2">
            {departure.bookingVelocity.toFixed(2)}
          </div>
          <div className="text-sm text-kaptio-grey-300">bookings/day</div>
        </motion.div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Data */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
          >
            <h3 className="text-lg font-bold text-kaptio-primary-800 mb-4">Booking Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="daysFromDeparture" 
                  label={{ value: 'Days Until Departure', position: 'insideBottom', offset: -5 }}
                  reversed
                />
                <YAxis label={{ value: 'Bookings', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-kaptio-grey-200 rounded shadow-lg">
                          <p className="text-sm font-medium">{payload[0].payload.daysFromDeparture} days out</p>
                          <p className="text-sm text-kaptio-primary-400">
                            Bookings: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#056F82" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pricing Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-kaptio-white rounded-lg shadow-kaptio p-6"
          >
            <h3 className="text-lg font-bold text-kaptio-primary-800 mb-4">Pricing Analysis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">Departure Price</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatCurrency(departure.currentPrice)}
                </div>
              </div>
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">Product Average</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatCurrency(product.currentPrice)}
                </div>
              </div>
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">Current Margin</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatPercent(departure.marginPercent)}
                </div>
              </div>
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">Target Margin</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatPercent(product.targetMargin)}
                </div>
              </div>
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">Cost Basis</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatCurrency(departure.costBasis)}
                </div>
              </div>
              <div>
                <div className="text-sm text-kaptio-grey-300 mb-1">RevPAS</div>
                <div className="text-2xl font-bold text-kaptio-primary-800">
                  {formatCurrency(departure.revenuePerAvailableSeat)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-1"
        >
          <div className={`bg-kaptio-white rounded-lg shadow-kaptio p-6 border-l-4 ${
            recommendation.type === 'opportunity' ? 'border-green-500' :
            recommendation.type === 'warning' ? 'border-yellow-500' :
            recommendation.type === 'success' ? 'border-kaptio-action' :
            'border-kaptio-primary-400'
          }`}>
            <h3 className="text-lg font-bold text-kaptio-primary-800 mb-3">
              {recommendation.title}
            </h3>
            <p className="text-kaptio-grey-400 mb-4">{recommendation.message}</p>
            
            {recommendation.recommendation && (
              <div className="bg-kaptio-primary-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-kaptio-primary-800">
                  {recommendation.recommendation}
                </p>
                {recommendation.impact && (
                  <p className="text-sm text-kaptio-primary-600 mt-2">
                    {recommendation.impact}
                  </p>
                )}
              </div>
            )}

            {recommendation.options && (
              <div className="space-y-4 mb-4">
                {recommendation.options.map((option, idx) => (
                  <div key={idx} className="border border-kaptio-grey-200 rounded-lg p-4">
                    <h4 className="font-bold text-kaptio-primary-800 mb-2">{option.title}</h4>
                    <p className="text-sm text-kaptio-grey-400 mb-2">{option.details}</p>
                    <p className="text-sm font-medium text-kaptio-primary-600">{option.impact}</p>
                  </div>
                ))}
              </div>
            )}

            {recommendation.actions && recommendation.actions.length > 0 && (
              <div className="space-y-2">
                {recommendation.actions.map((action, idx) => (
                  <button
                    key={idx}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      action.type === 'primary'
                        ? 'bg-kaptio-primary-400 text-white hover:bg-kaptio-primary-500'
                        : 'bg-kaptio-grey-100 text-kaptio-primary-800 hover:bg-kaptio-grey-200'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-kaptio-grey-200">
              <Link
                to={`/forecasting?product=${product.id}`}
                className="text-kaptio-primary-400 hover:text-kaptio-primary-500 font-medium text-sm flex items-center"
              >
                View Detailed Forecast
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

