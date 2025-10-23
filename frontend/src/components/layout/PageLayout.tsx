import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle, actions }) => {
  return (
    <div className="flex-1 overflow-auto">
      {(title || subtitle || actions) && (
        <div className="bg-kaptio-white border-b border-kaptio-grey-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-2xl font-bold text-kaptio-primary-800">{title}</h2>}
              {subtitle && <p className="text-sm text-kaptio-grey-300 mt-1">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
};

