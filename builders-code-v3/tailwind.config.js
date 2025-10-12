/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#121212',
        'dark-card': '#1E1E1E',
        'primary': '#0066FF',
        'secondary': '#6E44FF',
        'success': '#00D26A',
        'light-text': '#F5F5F5',
        'secondary-text': '#AAAAAA',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}
