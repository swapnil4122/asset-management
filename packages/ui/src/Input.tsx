import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
      {label && <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>}
      <input
        style={{
          padding: '0.5rem',
          borderRadius: '0.25rem',
          border: '1px solid #ccc'
        }}
        {...props}
      />
    </div>
  );
};
