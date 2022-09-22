const plugins = [['tailwindcss'], ['autoprefixer']];

if (process.env.NODE_ENV === 'production') {
  plugins.push(['cssnano']);
}

module.exports = { plugins };
