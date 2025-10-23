import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendDataPoint } from '../../types';

interface MarginTrendChartProps {
  data: TrendDataPoint[];
  targetMargin?: number;
}

export const MarginTrendChart: React.FC<MarginTrendChartProps> = ({ data, targetMargin = 28 }) => {
  return (
    <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-kaptio-primary-800">Margin Trend</h3>
        <p className="text-sm text-kaptio-grey-300 mt-1">12-month average margin performance</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#878787', fontSize: 12 }}
            stroke="#C3C3C3"
          />
          <YAxis 
            tick={{ fill: '#878787', fontSize: 12 }}
            stroke="#C3C3C3"
            domain={[20, 35]}
            label={{ value: 'Margin %', angle: -90, position: 'insideLeft', fill: '#878787' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #B4D4DA',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: any) => [`${value}%`, 'Margin']}
          />
          <ReferenceLine 
            y={targetMargin} 
            stroke="#056F82" 
            strokeDasharray="5 5"
            label={{ value: `Target: ${targetMargin}%`, fill: '#056F82', fontSize: 12 }}
          />
          <Line 
            type="monotone" 
            dataKey="margin" 
            stroke="#056F82" 
            strokeWidth={3}
            dot={{ fill: '#056F82', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

