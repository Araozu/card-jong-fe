/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "c-bg": "var(--c-bg)",
                "c-on-bg": "var(--c-on-bg)",
                "c-bg-2": "var(--c-bg-2)",
                "c-border-1": "var(--c-border-1)",
                "card-black-bg": "var(--card-black-bg)",
                "card-on-black-bg": "var(--card-on-black-bg)",
                "card-blue-bg": "var(--card-blue-bg)",
                "card-on-blue-bg": "var(--card-on-blue-bg)",
                "card-red-bg": "var(--card-red-bg)",
                "card-on-red-bg": "var(--card-on-red-bg)",
                "card-green-bg": "var(--card-green-bg)",
                "card-on-green-bg": "var(--card-on-green-bg)",
            },
            fontFamily: {
                "sans-serif": ["'Secular One'", "'sans-serif'"],
            },
        },
    },
    plugins: [],
};

