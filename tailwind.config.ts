import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F9F5F0',
        terracotta: '#C86B48',
        ocre: '#D4A373',
        sand: '#E6D5B8',
        'deep-blue': '#2C3E50',
        'dark-text': '#1A1A1A',
        'accent-red': '#B03A2E',
        'soft-gray': '#F0F0F0',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
