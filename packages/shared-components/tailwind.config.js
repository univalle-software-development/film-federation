/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Scan its own components
  ],
  theme: {
    extend: {
      // You might define shared theme extensions here later (colors, fonts)
      // especially if you integrate shadcn/ui
    },
  },
  plugins: [],
}