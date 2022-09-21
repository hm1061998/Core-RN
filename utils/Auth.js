import {
  accountLogin,
  queryCurrent,
  loginWithSocial,
  changepass,
  updateUser,
  registerUser,
} from '~/services/auth';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_KEY } from '@env';

class Auth {
  constructor(options) {
    this.emitter = new EventEmitter();
    this._user = null;
    this._token = null;
    this._authResult = false;
    this._tokenExpiration = false;
    if (options?.automatically) {
      this.init();
    }
  }

  get currentUser() {
    return this._user;
  }

  get token() {
    return this._token;
  }

  async init() {
    const initialToken = await AsyncStorage.getItem(AUTH_KEY);
    if (initialToken) {
      return this._fetchCurrent(initialToken);
    } else {
      return this._setUser();
    }
  }

  _setUser(user) {
    this._user = user || null;
    this._authResult = true;
    this.emitter.emit('onAuthStateChanged', this._user);
    return this._user;
  }

  onAuthStateChanged(listener) {
    const subscription = this.emitter.addListener(
      'onAuthStateChanged',
      listener,
    );

    if (this._authResult) {
      Promise.resolve().then(() => {
        listener(this._user || null);
      });
    }
    return () => subscription.remove();
  }

  onTokenStateChange(listener) {
    const subscription = this.emitter.addListener(
      'onTokenStateChange',
      listener,
    );

    if (this._tokenExpiration) {
      Promise.resolve().then(() => {
        listener(this._user || null);
      });
    }
    return () => subscription.remove();
  }

  async signInWithUser(params, callback) {
    const res = await accountLogin(params);
    if (res?.success) {
      this._fetchCurrent(res.token, callback);
    } else {
      callback?.(res);
    }

    return res;
  }

  async signInWithSocical(params, callback) {
    const res = await loginWithSocial(params);
    if (res?.success) {
      this._fetchCurrent(res.token, callback);
    } else {
      callback?.(res);
    }

    return res;
  }

  async signOut() {
    await AsyncStorage.removeItem(AUTH_KEY);
    this._token = null;
    this._setUser();
  }

  async _fetchCurrent(token, callback) {
    const res = await queryCurrent(token);
    if (res?.id) {
      this._token = token;
      AsyncStorage.setItem(AUTH_KEY, token);
      this._setUser(res);
    } else {
      this.expire();
    }
    // console.log({ res });
    callback?.(res);
    return res;
  }

  async updatePassword(password) {
    const user = await changepass(password);
    this.reload();
    return user;
  }

  async updateProfile(updates) {
    const user = await updateUser(updates);
    this.reload();
    return user;
  }

  async reload() {
    // console.log('run reload');
    const res = await queryCurrent(this._token);
    if (res?.id) {
      this._setUser(res);
    }
    return res;
  }

  expire() {
    // console.log('run expire');
    this._token = null;
    this._tokenExpiration = true;
    AsyncStorage.removeItem(AUTH_KEY);
    this._setUser();
    this.emitter.emit('onTokenStateChange', this._user);
  }

  async register(params) {
    const res = await registerUser(params);
    if (res?.success) {
    }
    return res;
  }
}

export default new Auth();
export { Auth };
