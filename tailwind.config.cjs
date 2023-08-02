const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    screens: {
      mobile: '600px',
      laptop: '800px',
      large: '1000px',
    },
    fontFamily: {
      sans: ['Raleway', 'HelveticaNeue', 'sans-serif'],
      caps: ['Oswald', 'Futura-CondensedMedium', 'sans-serif'],
    },
    extend: {
      spacing: {
        xs: '10px',
        sm: '15px',
        md: '30px',
        lg: '60px',
      },
      colors: {
        brand: 'firebrick', // #981212
      },
      inset: {
        'almost-full': 'calc(100% - 1px)',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, matchComponents, theme }) => {
      matchUtilities(
        {
          'min-aspect': (value) => ({
            '&::before': {
              content: "''",
              paddingTop: value,
              float: 'left',
            },
            '&::after': {
              content: "''",
              display: 'table',
              clear: 'both',
            },
          }),
        },
        {
          values: Object.entries(theme('aspectRatio')).reduce(
            (values, [k, aspect]) => {
              let n = Number(aspect)
              if (Number.isNaN(n)) {
                const [x, y] = aspect.split('/').map(Number)
                n = y / x
              }
              if (Number.isNaN(n)) return values
              return {
                ...values,
                [k]: (100 * n).toFixed(2) + '%',
              }
            },
            {},
          ),
        },
      )
      matchComponents(
        {
          'h-line': (value) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '&::before, &::after': {
              content: "''",
              flex: '1 1 auto',
              borderTopWidth: value,
              borderTopColor: 'inherit',
              borderTopStyle: 'inherit',
            },
            '&::before': {
              marginRight: '0.5em',
            },
            '&::after': {
              marginLeft: '0.5em',
            },
          }),
        },
        {
          values: theme('borderWidth'),
        },
      )
    }),
  ],
}
