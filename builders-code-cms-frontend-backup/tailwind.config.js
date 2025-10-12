/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end brutalist dark theme
        'dark': '#0A0A0A',
        'dark-elevated': '#111111',
        'dark-card': '#161616',
        'dark-hover': '#1A1A1A',
        'dark-border': '#2A2A2A',
        
        // Premium accent colors
        'primary': '#007AFF',
        'primary-hover': '#0051D5',
        'secondary': '#5856D6', 
        'accent': '#FF2D92',
        'success': '#32D74B',
        'warning': '#FF9F0A',
        'error': '#FF453A',
        
        // Notion-like text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#9B9B9B',
        'text-tertiary': '#6B6B6B',
        'text-quaternary': '#404040',
        
        // Glassmorphism
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        'sans': ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
        'display': ['SF Pro Display', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem', 
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(24px)',
        'blur-xl': 'blur(40px)',
      },
      boxShadow: {
        'neumorphic': '20px 20px 60px #0a0a0a, -20px -20px 60px #1a1a1a',
        'neumorphic-inset': 'inset 20px 20px 60px #0a0a0a, inset -20px -20px 60px #1a1a1a',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'brutal': '8px 8px 0px #007AFF',
        'brutal-hover': '12px 12px 0px #007AFF',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem', 
        '3xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 122, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}