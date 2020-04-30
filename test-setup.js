const React = require('react');

global['React'] = React;
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
