import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-[#1F2937] border border-[#1F2937] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-[#0B0F19]/20">
          {title && <h3 className="text-sm font-bold text-[#F9FAFB] tracking-tight uppercase tracking-widest">{title}</h3>}
          {subtitle && <p className="text-[11px] text-[#9CA3AF] mt-1 font-medium">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
