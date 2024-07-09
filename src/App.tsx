import React from 'react';
import { Home } from './pages';
import { Theme } from './components';
import Store from './store';
import './styles';

const App: React.FC = () => (
  <Store>
    <Theme>
      <Home />
    </Theme>
  </Store>
);

export default App;
