import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-kaptio-white border-b border-kaptio-grey-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-kaptio-primary-400 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-kaptio-primary-800">
              Departure Revenue Optimization
            </h1>
            <p className="text-xs text-kaptio-grey-300">Kaptio Edge | Yield Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-right">
            <div className="text-kaptio-grey-300 font-light text-xs">G Adventures</div>
            <div className="font-medium text-kaptio-primary-800">Demo Environment</div>
          </div>
          <div className="w-10 h-10 bg-kaptio-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-kaptio-primary-400">GA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

