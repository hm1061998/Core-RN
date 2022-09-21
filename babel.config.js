module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'module:react-native-dotenv',
      [
        'babel-plugin-root-import',
        {
          rootPathPrefix: '~', // Chúng ta cần cho babel biết "~"
          rootPathSuffix: '.', // sẽ được convert thành "."
        },
      ],
    ],
    retainLines: true,
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};
