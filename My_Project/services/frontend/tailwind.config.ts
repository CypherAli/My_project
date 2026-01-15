import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'tv-white': '#ffffff',
                'tv-gray-50': '#f9f9f9',
                'tv-gray-100': '#f2f2f2',
                'tv-gray-150': '#ebebeb',
                'tv-gray-200': '#dbdbdb',
                'tv-gray-300': '#b8b8b8',
                'tv-gray-400': '#9c9c9c',
                'tv-gray-550': '#707070',
                'tv-gray-600': '#636363',
                'tv-gray-800': '#2e2e2e',
                'tv-gray-900': '#0f0f0f',
                'tv-green': '#26a69a',
                'tv-red': '#f7525f',
                'tv-blue': '#2962ff',
                'tv-blue-dark': '#1e53e5',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Trebuchet MS', 'Roboto', 'Ubuntu', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
