import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00ae42',
          hover: '#009636',
          soft: '#e6f7ed',
        },

        'bg-light': '#f5f6f7',
        'bg-dark': '#121212',

        'surface-light': '#ffffff',
        'surface-dark': '#1a1a1a',

        'border-light': '#e5e7eb',
        'border-dark': '#2a2a2a',

        'muted-light': '#6b7280',
        'muted-dark': '#9ca3af',
      },
    },
  },
  plugins: [],
}

export default config
