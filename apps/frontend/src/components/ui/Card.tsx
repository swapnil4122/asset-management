import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-background-secondary border border-background-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-background-card">
          {title && <h3 className="text-sm font-bold text-text-primary tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
