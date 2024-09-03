/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['ClashDisplay-Regular', ...defaultTheme.fontFamily.sans],
            },
            height: {
                '70': '16em',
                '86': '390px',
                '98': '32em',
                '100': '38rem',
                '120': '50rem'
            },
            keyframes: {
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideOutRight: {
                    '0%': { transform: 'translateX(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
            },
            animation: {
                slideInRight: 'slideInRight 0.5s ease-out forwards',
                slideOutRight: 'slideOutRight 0.5s ease-in forwards',
            },
        },
    },
    plugins: [],
};