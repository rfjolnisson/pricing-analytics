import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent, getDeltaColor, getDeltaBgColor } from '../../utils/formatters';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  format?: 'currency' | 'percent' | 'number';
  alert?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  delta,
  deltaLabel,
  icon,
  format = 'number',
  alert = false,
}) => {
  const formatValue = () => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return formatCurrency(value);
    if (format === 'percent') return formatPercent(value);
    return value.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-kaptio-white rounded-lg shadow-kaptio p-6 ${
        alert ? 'border-2 border-kaptio-action' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-kaptio-grey-300 mb-2">{title}</div>
          <div className="text-3xl font-bold text-kaptio-primary-800 mb-2">
            {formatValue()}
          </div>
          {delta !== undefined && (
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDeltaBgColor(
                  delta
                )} ${getDeltaColor(delta)}`}
              >
                {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {Math.abs(delta).toFixed(1)}
                {format === 'percent' ? 'pp' : '%'}
              </span>
              {deltaLabel && (
                <span className="text-xs text-kaptio-grey-300">{deltaLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-kaptio-primary-100 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 text-kaptio-primary-400">{icon}</div>
        </div>
      </div>
    </motion.div>
  );
};

