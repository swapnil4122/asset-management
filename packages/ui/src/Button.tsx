import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem',
        backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
      }}
      {...props}
    >
      {children}
    </button>
  );
};
