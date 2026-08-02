/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1C3829',
          50:  '#EFF6F1',
          100: '#D4EAD9',
          200: '#A3CEB0',
          300: '#6AAF7E',
          400: '#4A8C5C',
          500: '#2D5A40',
          600: '#1C3829',
          700: '#162D21',
          800: '#112419',
          900: '#0C1A12',
        },
        neutral: {
          50:  '#F5F7F5',
          100: '#EAEFEB',
          200: '#DDE5DF',
          300: '#C4CEC6',
          400: '#9BA89E',
          500: '#7A8B80',
          600: '#5A6B62',
          700: '#3F5045',
          800: '#2D3B32',
          900: '#1A2420',
        },
        background: '#F8FAF8',
        surface: '#FFFFFF',
        border: '#E2E8E4',
        accent: '#4A8C5C',
      },
      fontFamily: {
        brand: ['Playfair Display', 'Georgia', 'serif'],
        ui:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '1.4' }],
        'sm':   ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.6' }],
        'md':   ['16px', { lineHeight: '1.6' }],
        'lg':   ['18px', { lineHeight: '1.5' }],
        'xl':   ['22px', { lineHeight: '1.4' }],
        '2xl':  ['28px', { lineHeight: '1.3' }],
        '3xl':  ['36px', { lineHeight: '1.2' }],
        '4xl':  ['48px', { lineHeight: '1.1' }],
        '5xl':  ['60px', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        widest: '0.12em',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'dropdown': '0 8px 32px rgba(0,0,0,0.12)',
        'modal': '0 24px 80px rgba(0,0,0,0.18)',
      },
      maxWidth: {
        'content': '1320px',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
