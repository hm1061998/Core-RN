export default ({ config }) => {
  return {
    ...config,
    name: process.env.NAME || config.name,
    ios: {
      ...config.ios,
      bundleIdentifier:
        process.env.BUNDLE_IDENTIFIER || config.ios.bundleIdentifier,
    },
    android: {
      ...config.android,
      package: process.env.PACKAGE || config.android.package,
    },
  };
};
