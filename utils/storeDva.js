import dva from 'dva-no-router';

const defaultConfig = {
  storeKey: '__APP_DVA_STORE__',
  debug: false,
  serializeState: state => state,
  deserializeState: state => state,
};

function createDvaStore(model, initialState) {
  let app;
  if (initialState) {
    app = dva({
      initialState,
    });
  } else {
    app = dva({});
  }
  const isArray = Array.isArray(model);
  if (isArray) {
    model.forEach(m => {
      app.model(m);
    });
  } else {
    app.model(model);
  }
  app.router(() => {});
  app.start();
  // console.log(app);
  const store = app._store;
  return store;
}

export default function (model, config) {
  let store = {};
  const configs = {
    ...defaultConfig,
    ...config,
  };

  const initStore = ({ initialState /* , ctx */ }) => {
    const { storeKey } = configs;
    const isServer = typeof window === 'undefined';
    if (isServer) {
      return createDvaStore(model);
    }
    // Memoize store if client
    if (!window[storeKey]) {
      window[storeKey] = createDvaStore(model, initialState);
    }
    return window[storeKey];
  };

  const _store = initStore(model);
  const initialState = configs.serializeState(_store.getState());
  const getStore = initStore({
    initialState,
  });
  store = getStore;
  return store;
}
