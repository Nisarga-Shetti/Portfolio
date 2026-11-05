/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05060F',
        'deep-navy': '#0A0F24',
        cyan: '#22E4FF',
        'electric-purple': '#A855F7',
        lavender: '#C084FC',
        magenta: '#F0ABFC',
        text: '#E6F1FF',
        muted: '#8FA3C7',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.6', filter: 'brightness(1.5)' },
        },
      },
    },
  },
  plugins: [],
};
