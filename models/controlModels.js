import * as THEMES from '~/utils/Themes';
import i18n from 'i18n-js';
import { VI, EN } from '~/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDB,
  getAllSetting,
  updateSetting as updateSettingDB,
} from '~/services/db-service';
import { FIRST_OPEN } from '@env';
import SET_SETTINGS from '~/utils/Values/settings';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  vi: { ...VI },
  en: { ...EN },
};

// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default {
  namespace: 'control',
  state: {
    isConnected: true,
    I18n: i18n,
    theme: THEMES.DARK,
    languageCode: 'vi',
    expoPushToken: '',
    initializing: true,
    isAuthenticated: false,
    settings: {
      ...SET_SETTINGS,
    },
    isFirstTimes: true,
  },
  effects: {
    *initApp(action, { put }) {
      const checkFirstTime = yield AsyncStorage.getItem(FIRST_OPEN);
      if (checkFirstTime !== null) {
        let settings = {};

        yield put({
          type: 'setFirstTimes',
          payload: false,
        });
        yield getAllSetting().then(resolve => {
          settings = resolve;
        });

        // console.log({ settings });
        yield put({
          type: 'SET_SETTINGS',
          payload: settings,
        });
      } else {
        yield put({
          type: 'setFirstTimes',
          payload: true,
        });
        yield createDB(SET_SETTINGS);
        yield AsyncStorage.setItem(FIRST_OPEN, '1');
      }
    },
    *updateSetting({ payload }, { call, put }) {
      yield put({
        type: 'SET_SETTINGS',
        payload: {
          [payload.key]: payload.value,
        },
      });
      yield call(updateSettingDB, payload);
    },
  },

  reducers: {
    changeConnected(state, action) {
      return {
        ...state,
        isConnected: action.payload,
      };
    },
    SET_SETTINGS(state, action) {
      let currentSetting = state.settings;
      currentSetting = {
        ...currentSetting,
        ...action.payload,
      };
      return {
        ...state,
        settings: currentSetting,
      };
    },
    SET_I18N(state, action) {
      let _i18n = state.I18n;
      _i18n.locale = action.payload;
      return {
        ...state,
        I18n: _i18n,
        languageCode: action.payload,
      };
    },
    SET_THEME(state, action) {
      return {
        ...state,
        theme: action.payload,
      };
    },
    SET_EXPOPUSHTOKEN(state, action) {
      return {
        ...state,
        expoPushToken: action.payload,
      };
    },
    SET_INIT(state, action) {
      return {
        ...state,
        initializing: action.payload,
      };
    },

    SET_isAuthenticated(state, action) {
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    },

    setFirstTimes(state, action) {
      return {
        ...state,
        isFirstTimes: action.payload,
      };
    },
  },
};
