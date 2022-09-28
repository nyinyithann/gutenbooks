function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  darkMode: 'class',
  content: ['public/index.html', 'src/*.{js, jsx}', 'src/**/*.{js, jsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'var(--color-primary-transparent)',
        current: 'currentColor',
        white: '#ffffff',
        black: '#000000',
        klor: {
          50: withOpacityValue('--color-primary-50'),
          100: withOpacityValue('--color-primary-100'),
          200: withOpacityValue('--color-primary-200'),
          300: withOpacityValue('--color-primary-300'),
          400: withOpacityValue('--color-primary-400'),
          500: withOpacityValue('--color-primary-500'),
          600: withOpacityValue('--color-primary-600'),
          700: withOpacityValue('--color-primary-700'),
          800: withOpacityValue('--color-primary-800'),
          900: withOpacityValue('--color-primary-900'),
        },
      },
      fontFamily: {
        nav: ['Oswald'],
        brand: ['Pacifico'],
        booktitle: ['Merriweather'],
        bookinfo: ['Source Sans Pro'],
      },
      textColor: {
        transparent: 'var(--color-primary-transparent)',
        50: withOpacityValue('--color-primary-50'),
        100: withOpacityValue('--color-primary-100'),
        200: withOpacityValue('--color-primary-200'),
        300: withOpacityValue('--color-primary-300'),
        400: withOpacityValue('--color-primary-400'),
        500: withOpacityValue('--color-primary-500'),
        600: withOpacityValue('--color-primary-600'),
        700: withOpacityValue('--color-primary-700'),
        800: withOpacityValue('--color-primary-800'),
        900: withOpacityValue('--color-primary-900'),
      },
      backgroundColor: {
        transparent: 'var(--color-primary-transparent)',
        50: withOpacityValue('--color-primary-50'),
        100: withOpacityValue('--color-primary-100'),
        200: withOpacityValue('--color-primary-200'),
        300: withOpacityValue('--color-primary-300'),
        400: withOpacityValue('--color-primary-400'),
        500: withOpacityValue('--color-primary-500'),
        600: withOpacityValue('--color-primary-600'),
        700: withOpacityValue('--color-primary-700'),
        800: withOpacityValue('--color-primary-800'),
        900: withOpacityValue('--color-primary-900'),
      },
      ringColor: {
        transparent: 'var(--color-primary-transparent)',
        50: withOpacityValue('--color-primary-50'),
        100: withOpacityValue('--color-primary-100'),
        200: withOpacityValue('--color-primary-200'),
        300: withOpacityValue('--color-primary-300'),
        400: withOpacityValue('--color-primary-400'),
        500: withOpacityValue('--color-primary-500'),
        600: withOpacityValue('--color-primary-600'),
        700: withOpacityValue('--color-primary-700'),
        800: withOpacityValue('--color-primary-800'),
        900: withOpacityValue('--color-primary-900'),
      },
      borderColor: {
        transparent: 'var(--color-primary-transparent)',
        50: withOpacityValue('--color-primary-50'),
        100: withOpacityValue('--color-primary-100'),
        200: withOpacityValue('--color-primary-200'),
        300: withOpacityValue('--color-primary-300'),
        400: withOpacityValue('--color-primary-400'),
        500: withOpacityValue('--color-primary-500'),
        600: withOpacityValue('--color-primary-600'),
        700: withOpacityValue('--color-primary-700'),
        800: withOpacityValue('--color-primary-800'),
        900: withOpacityValue('--color-primary-900'),
      },
      boxShadowColor: {
        transparent: 'var(--color-primary-transparent)',
        50: withOpacityValue('--color-primary-50'),
        100: withOpacityValue('--color-primary-100'),
        200: withOpacityValue('--color-primary-200'),
        300: withOpacityValue('--color-primary-300'),
        400: withOpacityValue('--color-primary-400'),
        500: withOpacityValue('--color-primary-500'),
        600: withOpacityValue('--color-primary-600'),
        700: withOpacityValue('--color-primary-700'),
        800: withOpacityValue('--color-primary-800'),
        900: withOpacityValue('--color-primary-900'),
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
};
