import React, { Component } from 'react';
import './App.css';
import { auth, database } from './firebase';
// components
import SignIn from './components/SignIn';
import CurrentUser from './components/CurrentUser';
import NewRestaurant from './components/NewRestaurant';
import Restaurants from './components/Restaurants';
// import Leaderboard from './components/Leaderboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      restaurants: null
    }
    this.restaurantRef = database.ref('/restaurants');
  }
  componentDidMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({
        currentUser
      })
      this.restaurantRef.on('value', (snapshot) => {
        this.setState({ restaurants: snapshot.val() });
      })
    })
  }
  render() {
    const { currentUser, restaurants } = this.state;
    return (
      <div className="Application">
        <h1>What's For Lunch?</h1>
        {!currentUser && <SignIn />}
        {currentUser &&
          <div className="Application-SignedOn">
            <div className="Application--SearchBar">
              <NewRestaurant />
              <CurrentUser user={currentUser} />
            </div>
            <div className="Application--Body">
              {/* <Leaderboard restaurants={restaurants} /> */}
              <Restaurants restaurants={restaurants} user={currentUser} />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
