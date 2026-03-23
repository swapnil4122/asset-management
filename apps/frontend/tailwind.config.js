export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0B0F19',
          secondary: '#111827',
          card: '#1F2937',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          green: '#10B981',
          red: '#EF4444',
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      }
    },
  },
  plugins: [],
}
