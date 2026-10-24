/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: withOpacity('--primary-rgb'),
          primaryHover: withOpacity('--primary-hover-rgb'),
          primaryDark: 'var(--primary-dark)',
          primaryLight: 'var(--primary-light)',
          primaryLightHover: 'var(--primary-light-hover)',
          primaryBorder: 'var(--primary-border)',

          // Dynamic theme-aware aliases
          purple: withOpacity('--primary-rgb'),
          purpleSecondary: withOpacity('--primary-rgb'),
          purpleDark: withOpacity('--primary-hover-rgb'),
          purpleLight: 'var(--primary-light)',
          orange: withOpacity('--primary-rgb'),
          orangeHover: withOpacity('--primary-hover-rgb'),
          orangeLight: 'var(--primary-light)',

          bg: '#FFFFFF',
          sectionBg: '#F8F8FA',
          textDark: '#151515',
          textGray: '#777777',
          border: '#EAEAEA',
          accentOrange: withOpacity('--primary-rgb'),
          accentOrangeLight: 'var(--primary-light)',
          black: '#151515',
          dark: '#1F1F1F',
          card: '#FFFFFF',
          grayLight: '#F8F8FA',
          grayText: '#777777',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'primary-glow': 'var(--primary-glow)',
        'purple-glow': 'var(--primary-glow)',
        'glow-orange': 'var(--primary-glow)',
        'card-soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 35px rgba(var(--primary-rgb), 0.12)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
