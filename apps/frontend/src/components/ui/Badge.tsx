import React from 'react';

type BadgeColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  variant?: 'solid' | 'soft' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

const colorMap = {
  blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  green: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  red: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  slate: 'bg-background-card text-text-secondary border-background-card',
};

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'blue', 
  className = '',
  icon
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border transition-all';
  const colorStyles = colorMap[color];
  
  return (
    <span className={`${baseStyles} ${colorStyles} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
