const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    ...tsjPreset.globals,
    'ts-jest': {
      babelConfig: true,
      // Temporary because of react native paper
      isolatedModules: true,
    },
  },
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './test-setup.js',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',
};
