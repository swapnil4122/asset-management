import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`
            w-full bg-background-secondary border rounded-xl py-3 px-4 pr-10 text-sm text-text-primary 
            appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/50 
            transition-all duration-200
            ${error 
              ? 'border-accent-red/50 focus:ring-accent-red/30' 
              : 'border-background-card focus:border-accent-blue/50'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background-secondary text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue pointer-events-none transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="text-[11px] font-bold text-accent-red ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
