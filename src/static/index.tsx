import * as React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './index.css';

const rootEl = document.getElementById('app');

render(<App />, rootEl);
