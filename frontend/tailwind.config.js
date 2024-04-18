/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['ClashDisplay-Regular', ...defaultTheme.fontFamily.sans],
            }
        },
    },
    plugins: [],
};