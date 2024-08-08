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
                '120': '50rem',
            },
            width: {
                'table': ''
            }
        },
    },
    plugins: [],
};