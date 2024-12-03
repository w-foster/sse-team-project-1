// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        customTheme: {
          light: '#4F46E5', // Indigo-600 for light mode
          dark: '#1E3A8A', // Indigo-900 for dark mode or a custom color
          DEFAULT: '#10B981', // Example default color
        },
      },
    },
  },
  darkMode: 'class', // Enables dark mode with the `class` strategy
  plugins: [],
};