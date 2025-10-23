/** @type {import('tailwindcss').Config} */
module.exports = {
  // This is the most important part for CRA
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        primary: '#007BFF',
        'primary-hover': '#0056b3',
        background: '#FFFFFF',
        foreground: '#F7F9FC',
        'nav-bg': '#FFFFFF',
        text: '#1a202c',
        'text-secondary': '#718096',
        border: '#E2E8F0',

        // Dark Mode Colors
        'dark-primary': '#4A90E2',
        'dark-primary-hover': '#357ABD',
        'dark-background': '#121212',
        'dark-foreground': '#1E1E1E',
        'dark-nav-bg': '#1A1A1A',
        'dark-text': '#E0E0E0',
        'dark-text-secondary': '#A0AEC0',
        'dark-border': '#2D3748',
      },
    },
  },
  plugins: [],
};
