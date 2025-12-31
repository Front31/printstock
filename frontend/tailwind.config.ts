import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ✅ Brand / Accent
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          soft: 'rgb(var(--primary-soft) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },

        // ✅ Neutrals (Bambu-like, ohne Blaustich)
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',

        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-foreground': 'rgb(var(--surface-foreground) / <alpha-value>)',

        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',

        border: 'rgb(var(--border) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

export default config
