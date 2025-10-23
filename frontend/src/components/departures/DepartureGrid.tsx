import React from 'react';
import { Departure } from '../../types';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';

interface DepartureGridProps {
  departures: Departure[];
  onDepartureClick?: (departure: Departure) => void;
}

export const DepartureGrid: React.FC<DepartureGridProps> = ({ departures, onDepartureClick }) => {
  if (departures.length === 0) {
    return (
      <div className="bg-kaptio-white rounded-lg shadow-kaptio p-12 text-center">
        <p className="text-kaptio-grey-300">No departures available</p>
      </div>
    );
  }

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'fast': return 'bg-green-100 text-green-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'slow': return 'bg-yellow-100 text-yellow-700';
      case 'stalled': return 'bg-red-100 text-red-700';
      default: return 'bg-kaptio-grey-100 text-kaptio-grey-300';
    }
  };

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

  const getPaceIcon = (pace: string) => {
    switch (pace) {
      case 'fast': return '🔥';
      case 'stalled': return '⚠️';
      default: return '';
    }
  };

  return (
    <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-kaptio-primary-800">Departure Calendar</h3>
        <p className="text-sm text-kaptio-grey-300 mt-1">
          {departures.length} departures • Click any departure for details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departures.map((departure) => (
          <div
            key={departure.id}
            onClick={() => onDepartureClick && onDepartureClick(departure)}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
              onDepartureClick ? 'cursor-pointer' : ''
            } ${
              departure.status === 'sold_out'
                ? 'border-kaptio-action bg-red-50'
                : departure.status === 'nearly_full'
                ? 'border-kaptio-yellow-400 bg-yellow-50'
                : departure.status === 'cancelled'
                ? 'border-kaptio-grey-200 bg-kaptio-grey-100 opacity-60'
                : 'border-kaptio-grey-200 hover:border-kaptio-primary-400'
            }`}
          >
            {/* Header with Date */}
            <div className="mb-3 pb-3 border-b border-kaptio-grey-100">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-kaptio-primary-800">
                  {formatDate(departure.departureDate)}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(departure.status)}`}>
                  {getStatusLabel(departure.status)}
                </span>
              </div>
              <div className="text-xs text-kaptio-grey-300">
                {departure.daysUntilDeparture} days away
              </div>
            </div>

            {/* Capacity & Bookings */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-kaptio-grey-300">Capacity</span>
                <span className="text-sm font-medium text-kaptio-primary-800">
                  {departure.bookings} / {departure.capacity}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-kaptio-grey-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    departure.occupancyRate >= 95
                      ? 'bg-kaptio-action'
                      : departure.occupancyRate >= 80
                      ? 'bg-kaptio-yellow-400'
                      : departure.occupancyRate >= 50
                      ? 'bg-kaptio-primary-400'
                      : 'bg-kaptio-grey-300'
                  }`}
                  style={{ width: `${Math.min(departure.occupancyRate, 100)}%` }}
                />
              </div>
              
              <div className="text-xs text-kaptio-grey-300 mt-1">
                {formatPercent(departure.occupancyRate, 0)} occupancy
              </div>
            </div>

            {/* Price & Margin */}
            <div className="mb-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-kaptio-grey-300">Price</span>
                <span className="text-sm font-bold text-kaptio-primary-800">
                  {formatCurrency(departure.currentPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-kaptio-grey-300">Margin</span>
                <span className="text-sm font-medium text-kaptio-primary-800">
                  {formatPercent(departure.marginPercent)}
                </span>
              </div>
            </div>

            {/* Booking Pace */}
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${getPaceColor(departure.bookingPace)}`}>
                {getPaceIcon(departure.bookingPace)} {departure.bookingPace.charAt(0).toUpperCase() + departure.bookingPace.slice(1)} Pace
              </span>
              {departure.lastBookingDate && (
                <span className="text-xs text-kaptio-grey-300">
                  Last: {new Date(departure.lastBookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

