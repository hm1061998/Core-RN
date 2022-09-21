import { COLOR, SIZES } from '~/utils/Values';
import { StyleSheet } from 'react-native';
const { plugin } = require('twrnc');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        times: 'Times',
        roboto: 'Roboto',
      },
      fontSize: {
        xs: '12px',
      },
      colors: {
        'regal-blue': '#243c5a',
        ...COLOR,
      },
      screens: {
        sm: '380px',
        md: '420px',
        lg: '680px',
        // or maybe name them after devices for `tablet:flex-row`
        tablet: '1024px',
      },
      spacing: {
        'status-bar': `${SIZES.HEIGHT_STATUSBAR}px`,
        'height-top': `${SIZES.HEIGHT_STATUSBAR + 10}px`,
      },
      borderWidth: {
        '07': '0.7px',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        sizes: { ...SIZES },
        'absolute-fill': { ...StyleSheet.absoluteFillObject },
        'resize-center': {
          resizeMode: 'center',
        },
        'resize-cover': {
          resizeMode: 'cover',
        },
        'resize-contain': {
          resizeMode: 'contain',
        },
      });
    }),
  ],
};
