import { moderateScale } from 'react-native-size-matters';

export const SHADOW_7 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateScale(4, 1),
  },
  shadowOpacity: 0.3,
  shadowRadius: moderateScale(4.65, 1),

  elevation: 7,
};

export const SHADOW_5 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateScale(3, 1),
  },
  shadowOpacity: 0.25,
  shadowRadius: moderateScale(3.65, 1),

  elevation: 5,
};

export const SHADOW_3 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateScale(2, 1),
  },
  shadowOpacity: 0.2,
  shadowRadius: moderateScale(2.22, 1),

  elevation: 3,
};

export const SHADOW_2 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateScale(2, 1),
  },
  shadowOpacity: 0.15,
  shadowRadius: moderateScale(1.41, 1),

  elevation: 2,
};

export const SHADOW_1 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: moderateScale(1, 1),
  },
  shadowOpacity: 0.1,
  shadowRadius: moderateScale(0.7, 1),

  elevation: 1,
};

export const SHADOW_0 = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,

  elevation: 0,
};
