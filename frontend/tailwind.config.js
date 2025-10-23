/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kaptio: {
          // Primary Palette - Teal/Cyan Family
          'primary-800': '#032E36',
          'primary-600': '#034955',
          'primary-500-orange': '#F18525',
          'primary-400': '#056F82',
          'primary-300': '#69A9B4',
          'primary-200': '#B4D4DA',
          'primary-100': '#E6F1F2',
          'primary-50': '#EFF5F5',
          
          // Yellow - Primary CTA Color
          'yellow-400': '#FFBC42',
          'yellow-300': '#FFD78E',
          'yellow-200': '#FFEBC6',
          
          // Secondary - Pink/Magenta
          'secondary-600': '#AF0072',
          'secondary-400': '#DE37A4',
          
          // Neutrals
          'background': '#F9FAF8',
          'black': '#212121',
          'grey-100': '#EBEBEB',
          'grey-200': '#C3C3C3',
          'grey-300': '#878787',
          'white': '#FFFFFF',
          'action': '#C1121F',
        }
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
        sans: ['Lexend', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'kaptio': '0 100px 80px rgba(0,0,0,0.07), 0 41.778px 33.422px rgba(0,0,0,0.05), 0 22.336px 17.869px rgba(0,0,0,0.04), 0 12.522px 10.017px rgba(0,0,0,0.04), 0 6.65px 5.32px rgba(0,0,0,0.03), 0 2.767px 2.214px rgba(0,0,0,0.02)',
        'button': '0 1px 2px rgba(16,24,40,0.05)',
      },
    },
  },
  plugins: [],
}

