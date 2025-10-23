import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency, formatPercent, getMarginColor, getMarginBgColor } from '../../utils/formatters';

interface ProductTableProps {
  products: Product[];
  maxRows?: number;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, maxRows = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'all' || p.region === regionFilter;
      return matchesSearch && matchesRegion;
    })
    .slice(0, maxRows);

  const regions = ['all', ...Array.from(new Set(products.map((p) => p.region)))];

  return (
    <div className="bg-kaptio-white rounded-lg shadow-kaptio p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-kaptio-primary-800">Product Portfolio</h3>
          <p className="text-sm text-kaptio-grey-300 mt-1">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-kaptio-grey-200 rounded-lg focus:outline-none focus:border-kaptio-primary-400"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2 border border-kaptio-grey-200 rounded-lg focus:outline-none focus:border-kaptio-primary-400"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-kaptio-grey-100">
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Product</th>
              <th className="text-left py-3 px-4 text-sm font-bold text-kaptio-primary-800">Region</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">Price</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">Current Margin</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">Target</th>
              <th className="text-right py-3 px-4 text-sm font-bold text-kaptio-primary-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-kaptio-grey-100 hover:bg-kaptio-primary-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-kaptio-primary-800">{product.name}</div>
                  <div className="text-xs text-kaptio-grey-300">{product.code}</div>
                </td>
                <td className="py-4 px-4 text-sm text-kaptio-grey-300">{product.region}</td>
                <td className="py-4 px-4 text-right font-medium text-kaptio-primary-800">
                  {formatCurrency(product.currentPrice)}
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMarginBgColor(
                      product.currentMargin,
                      product.targetMargin
                    )} ${getMarginColor(product.currentMargin, product.targetMargin)}`}
                  >
                    {formatPercent(product.currentMargin)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-sm text-kaptio-grey-300">
                  {formatPercent(product.targetMargin)}
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm text-kaptio-primary-400 hover:text-kaptio-primary-600 font-medium"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

