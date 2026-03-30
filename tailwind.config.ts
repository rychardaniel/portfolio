import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
      colors: {
        accent: {
          light: '#2563EB',
          dark: '#60A5FA',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

