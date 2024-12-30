import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chromeo: {
          50: 'rgb(var(--chromeo-50) / <alpha-value>)',
          100: 'rgb(var(--chromeo-100) / <alpha-value>)',
          200: 'rgb(var(--chromeo-200) / <alpha-value>)',
          300: 'rgb(var(--chromeo-300) / <alpha-value>)',
          400: 'rgb(var(--chromeo-400) / <alpha-value>)',
          500: 'rgb(var(--chromeo-500) / <alpha-value>)',
          600: 'rgb(var(--chromeo-600) / <alpha-value>)',
          700: 'rgb(var(--chromeo-700) / <alpha-value>)',
          800: 'rgb(var(--chromeo-800) / <alpha-value>)',
          900: 'rgb(var(--chromeo-900) / <alpha-value>)',
          950: 'rgb(var(--chromeo-950) / <alpha-value>)'
        }
      }
    },
    textColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.chromeo.800')
    }),
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.chromeo.400')
    })
  },
  plugins: []
} satisfies Config;
