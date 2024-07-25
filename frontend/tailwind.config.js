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
                '98': '32em',
                '100': '38rem',
                '120': '50rem',
            },
            // screens: {
            //     'sm': '640px',
            //     'md': '768px',
            //     'lg': '1024px',
            //     'xl': '1280px',
            //     '2xl': '1536px',
            // },
        },
    },
    plugins: [],
};