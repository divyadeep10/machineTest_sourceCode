// client/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {}, // This is the correct way to include Tailwind CSS as a PostCSS plugin
    autoprefixer: {}, // Autoprefixer is often used with Tailwind CSS for vendor prefixes
  },
};
