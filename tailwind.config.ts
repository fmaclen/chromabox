import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        themed: {
          50: 'rgb(var(--themed-50) / <alpha-value>)',
          100: 'rgb(var(--themed-100) / <alpha-value>)',
          200: 'rgb(var(--themed-200) / <alpha-value>)',
          300: 'rgb(var(--themed-300) / <alpha-value>)',
          400: 'rgb(var(--themed-400) / <alpha-value>)',
          500: 'rgb(var(--themed-500) / <alpha-value>)',
          600: 'rgb(var(--themed-600) / <alpha-value>)',
          700: 'rgb(var(--themed-700) / <alpha-value>)',
          800: 'rgb(var(--themed-800) / <alpha-value>)',
          900: 'rgb(var(--themed-900) / <alpha-value>)',
          950: 'rgb(var(--themed-950) / <alpha-value>)'
        }
      }
    },
    textColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.themed.800')
    }),
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.themed.400')
    })
  },
  plugins: []
} satisfies Config;
