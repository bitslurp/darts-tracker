import React from 'react';
import {App} from './App';

import {render} from 'react-native-testing-library';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
  });
});
