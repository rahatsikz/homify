module.exports = function (api) {
  api.cache(true);

  let useWorklets = false;

  try {
    require.resolve('react-native-worklets');
    useWorklets = true;
  } catch (e) {
    useWorklets = false;
  }

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          '@': './',
        },
      },
    ],
    useWorklets ? 'react-native-worklets/plugin' : 'react-native-reanimated/plugin',
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
