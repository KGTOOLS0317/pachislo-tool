// components/common/InputCard.tsx
import React from 'react';

export const InputCard: React.FC<{ title?: string; icon?: string; children: React.ReactNode, className?: string }> = ({ title, icon, children, className ="" }) => (
  <div className={`p-3 rounded-lg shadow border border-gray-200 ${className}`}>
    {title && (
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-semibold text-sky-700">{title}</h3>
      </div>
    )}
    {children}
  </div>
);
InputCard.displayName = 'InputCard';
