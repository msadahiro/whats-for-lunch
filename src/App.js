import React, { Component } from 'react';
import './App.css';
import { auth, database } from './firebase';
// components
import SignIn from './components/SignIn';
import CurrentUser from './components/CurrentUser';
import NewRestaurant from './components/NewRestaurant';
import Restaurants from './components/Restaurants';
import Leaderboard from './components/Leaderboard';
import HowItWorks from './components/HowItWorks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      restaurants: null,
    }
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const date = `${month}${day}${year}`
    this.restaurantRef = database.ref(`${date}/restaurants`);
  }
  componentWillMount() {
    auth.onAuthStateChanged((currentUser) => {
      this.setState({
        currentUser
      })
      this.getRestaurants()
    })
  }
  getRestaurants() {
    this.restaurantRef.on('value', (snapshot) => {
      this.setState({ restaurants: snapshot.val() });
    })
  }
  getDate() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    return `${month}${day}${year}`
  }
  render() {
    const { currentUser, restaurants } = this.state;
    return (
      <div className="Application">
        {!currentUser &&
          <div>
            <h1 className="Application--title">What's For Lunch?</h1>
            <HowItWorks />
            <SignIn />
          </div>
        }
        {(currentUser && !restaurants) &&
          <div className="Application-SignedOn">
            <h1 className="Application--title">What's For Lunch?</h1>
            <div className="Application--SearchBar">
              <NewRestaurant />
              <CurrentUser user={currentUser} />
            </div>
          </div>
        }
        {(currentUser && restaurants) &&
          <div className="Application-SignedOn">
            <div className="Application--Header">
              <h3 className="Application--SignedOn--Title">What's For Lunch?</h3>
              <NewRestaurant getDate={() => this.getDate()} />
              <CurrentUser user={currentUser} />
            </div>
            <div className="Application--Body">
              <Leaderboard restaurants={restaurants} />
              <Restaurants restaurants={restaurants} user={currentUser} getDate={() => this.getDate()} />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;