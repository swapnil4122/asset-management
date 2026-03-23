import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  description?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-accent-blue/10',
    text: 'text-accent-blue',
    border: 'border-l-accent-blue',
  },
  purple: {
    bg: 'bg-accent-purple/10',
    text: 'text-accent-purple',
    border: 'border-l-accent-purple',
  },
  green: {
    bg: 'bg-accent-green/10',
    text: 'text-accent-green',
    border: 'border-l-accent-green',
  },
  red: {
    bg: 'bg-accent-red/10',
    text: 'text-accent-red',
    border: 'border-l-accent-red',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-l-orange-500',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  description 
}) => {
  const styles = colorMap[color];

  return (
    <Card className={`border-l-4 ${styles.border}`}>
      <div className="flex justify-between items-start">
        <div className={`p-2.5 ${styles.bg} ${styles.text} rounded-xl`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold ${
            trend.type === 'up' ? 'text-accent-green' : 
            trend.type === 'down' ? 'text-accent-red' : 'text-text-secondary'
          }`}>
            {trend.type === 'up' && <ArrowUpRight size={14} className="mr-1" />}
            {trend.type === 'down' && <ArrowDownRight size={14} className="mr-1" />}
            {trend.type === 'neutral' && <Minus size={14} className="mr-1" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">{title}</p>
        <h2 className="text-3xl font-black text-text-primary mt-1 tracking-tight">{value}</h2>
        {description && (
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
