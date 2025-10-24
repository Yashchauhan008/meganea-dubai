/** @type {import('tailwindcss').Config} */
module.exports = {
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
        background: '#F7F9FC', // Lighter main background
        foreground: '#FFFFFF', // Cards, modals background
        'nav-bg': '#FFFFFF',
        text: '#1a202c',
        'text-secondary': '#718096',
        border: '#E2E8F0',

        // Dark Mode Colors (inspired by your example)
        'dark-primary': '#4A90E2',
        'dark-primary-hover': '#357ABD',
        'dark-background': '#121212', // Main background
        'dark-foreground': '#1E1E1E', // Sidebar, cards background
        'dark-nav-bg': '#1A1A1A',
        'dark-text': '#E0E0E0',
        'dark-text-secondary': '#A0AEC0',
        'dark-border': '#2D3748',
      },
    },
  },
  plugins: [],
};
