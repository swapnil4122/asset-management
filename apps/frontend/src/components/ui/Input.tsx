import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
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
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-background-secondary border rounded-xl py-3 px-4 text-sm text-text-primary 
            placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 
            transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error 
              ? 'border-accent-red/50 focus:ring-accent-red/30' 
              : 'border-background-card focus:border-accent-blue/50'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-bold text-accent-red ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
