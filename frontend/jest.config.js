module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Run this setup file after Jest is configured
    testEnvironment: 'jsdom', // Simulate a browser environment for React components
    testMatch: [
      '**/tests/components/**/*.test.js', // Match .test.js files in tests/components
    ],
  };