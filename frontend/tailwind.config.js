module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: 'black',
        secondaryLight: 'white',
        primaryLightBackground: 'white',
        secondaryLightBackground: 'black',
        accentLightBackground: 'white', // indigo-600

        primaryDark: 'white', // Primary text color for dark mode
        secondaryDark: 'black', // Secondary text color for dark mode
        primaryDarkBackground: 'black', // Dark mode background color
        secondaryDarkBackground: 'white', // Dark mode background color
        accentDarkBackground: 'black', // indigo-800
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
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'], // Set your preferred sans-serif fonts
        serif: ['Merriweather', 'serif'], // Set your preferred serif fonts
      },
    },
  },
  darkMode: 'class', // Enables dark mode with the `class` strategy
  plugins: [],
};
