import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-kaptio-primary-400 text-white shadow-button'
          : 'text-kaptio-grey-300 hover:bg-kaptio-primary-50 hover:text-kaptio-primary-800'
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Departure Inventory',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      to: '/forecasting',
      label: 'Optimization Tools',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      to: '/portfolio',
      label: 'Portfolio View',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-kaptio-white border-r border-kaptio-grey-100 p-6">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-kaptio-grey-100">
        <h3 className="text-xs font-bold text-kaptio-grey-300 uppercase mb-3">Inventory Stats</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-kaptio-primary-800">~840</div>
            <div className="text-xs text-kaptio-grey-300">Total Departures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">67</div>
            <div className="text-xs text-kaptio-grey-300">Fast-Pace 🔥</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-kaptio-action">43</div>
            <div className="text-xs text-kaptio-grey-300">At-Risk ⚠️</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

