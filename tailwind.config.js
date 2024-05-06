/** @type {import('tailwindcss').Config} */
module.exports = {
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
            },
        },
    },
    plugins: [],
};

