import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';

import {
  RecoilRoot,
} from 'recoil';

const domNode = document.getElementById('root');
const root = createRoot(domNode!);


root.render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
);
