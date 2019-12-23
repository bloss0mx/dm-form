import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { obj2Field } from '../src/dm-form/DmForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('');
