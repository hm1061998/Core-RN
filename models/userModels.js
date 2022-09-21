import { updateUser, changepass } from '~/services/auth';

export default {
  namespace: 'user',
  state: {
    currentUser: null,
  },
  effects: {
    *update({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      if (callback) {
        callback(response);
      }
    },
    *changePass({ payload, callback }, { call }) {
      const response = yield call(changepass, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    setCurrent(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
