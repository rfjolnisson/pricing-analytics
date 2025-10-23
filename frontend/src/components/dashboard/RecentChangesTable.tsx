import React from 'react';
import { RecentChange } from '../../types';
import { formatCurrency, formatDate, formatDelta, getDeltaColor } from '../../utils/formatters';

interface RecentChangesTableProps {
  changes: RecentChange[];
}

export const RecentChangesTable: React.FC<RecentChangesTableProps> = ({ changes }) => {
  return (
    <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-kaptio-primary-800">Recent Price Changes</h3>
        <p className="text-sm text-kaptio-grey-300 mt-1">Last 20 pricing updates</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-kaptio-grey-100">
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Date</th>
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Product</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">New Price</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">Margin</th>
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Reason</th>
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Changed By</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr
                key={change.id}
                className="border-b border-kaptio-grey-100 hover:bg-kaptio-primary-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-kaptio-grey-300">
                  {formatDate(change.effectiveDate)}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-kaptio-primary-800 text-sm">{change.productName}</div>
                  <div className="text-xs text-kaptio-grey-300">{change.season}</div>
                </td>
                <td className="py-3 px-4 text-right font-medium text-kaptio-primary-800">
                  {formatCurrency(change.basePrice)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-sm font-medium ${getDeltaColor(change.marginPercent - 28)}`}>
                    {formatDelta(change.marginPercent, false)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-kaptio-primary-100 text-kaptio-primary-800">
                    {change.reasonCode}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-kaptio-grey-300">{change.changedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

