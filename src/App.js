import React, { Component } from 'react';
import './App.css';
import { auth, database } from './firebase';
// components
import SignIn from './components/SignIn';
import CurrentUser from './components/CurrentUser';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    }
  }
  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({
        currentUser
      })
    })
  }
  render() {
    const { currentUser } = this.state;
    return (
      <div className="Application">
        {!currentUser && <SignIn />}
        {currentUser &&
          <div>
            <CurrentUser user={currentUser} />
          </div>
        }
      </div>
    );
  }
}

export default App;
