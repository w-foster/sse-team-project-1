module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: 'black', // Green-500 for light mode
        secondaryLight: 'white', // Gray-100 for light mode
        primaryLightBackground: 'white', // White for light mode
        secondaryLightBackground: 'black', // Gray-800 for light mode

        primaryDark: 'white', // Primary text color for dark mode
        secondaryDark: 'black', // Secondary text color for dark mode
        primaryDarkBackground: 'black', // Dark mode background color
        secondaryDarkBackground: 'white', // Dark mode background color
      },
      animation: {
        'scroll-left': 'scroll-left 10s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  darkMode: 'class', // Enables dark mode with the `class` strategy
  plugins: [],
};
