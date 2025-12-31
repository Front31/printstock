import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* 🔰 Brand */
        primary: {
          DEFAULT: '#00ae42',
          hover: '#009636',
          soft: '#e6f7ed',
        },

        /* 🌫️ Neutrale Grautöne (kein Blaustich!) */
        background: {
          light: '#f5f6f7',
          dark: '#121212',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        border: {
          light: '#e5e7eb',
          dark: '#2a2a2a',
        },
        muted: {
          light: '#6b7280',
          dark: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}

export default config
