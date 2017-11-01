import React, { Component } from 'react';
import './App.css';

import SignIn from './components/SignIn';

class App extends Component {
  render() {
    return (
      <div className="Application">
        <SignIn />
      </div>
    );
  }
}

export default App;
