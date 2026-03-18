import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // ضروري بزاف هاد السطر
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      darkMode: " class",
      colors: {
        background: '#020617',
        accent: '#22c55e',
        'accent-dim': 'rgba(34, 197, 94, 0.3)',
        'accent-glow': 'rgba(34, 197, 94, 0.5)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        starfield: 'starfield 6s infinite linear alternate',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        starfield: {
          '0%': { transform: 'translate(0,0)', opacity: '0.8' },
          '100%': { transform: 'translate(-10px,-20px)', opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
