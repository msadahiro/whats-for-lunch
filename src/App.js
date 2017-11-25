import React, { Component } from 'react';
import './App.css';
import { auth, database } from './firebase';
// components
import SignIn from './components/SignIn';
import CurrentUser from './components/CurrentUser';
import NewRestaurant from './components/NewRestaurant';
import Restaurants from './components/Restaurants';
// import Leaderboard from './components/Leaderboard';
import HowItWorks from './components/HowItWorks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      restaurants: null,
      restaurantsListWithCount: {},
      leaders: []
    }
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const date = `${month}${day}${year}`
    this.restaurantRef = database.ref(`${date}/restaurants`);
  }
  async componentWillMount() {
    await auth.onAuthStateChanged((currentUser) => {
      this.setState({
        currentUser
      })
      this.getRestaurants();
      this.getRestaurantsWithCount();
    })
  }
  getRestaurants() {
    this.restaurantRef.on('value', (snapshot) => {
      this.setState({ restaurants: snapshot.val() });
    })
  }
  getRestaurantsWithCount() {
    const { restaurantsListWithCount } = this.state;
    const date = this.getDate()
    database.ref(`${date}/restaurants`).on('value', (data) => {
      data.forEach(data => {
        let name = data.val().restaurantName;
        this.getCount(name).then((resultCount) => {
          if (restaurantsListWithCount[name] === undefined) {
            const newRestaurantListsWithCount = {
              ...this.state.restaurantsListWithCount
            }
            newRestaurantListsWithCount[name] = resultCount;
            this.setState({
              restaurantsListWithCount: newRestaurantListsWithCount
            }, () => this.getLeader())
          }
        })
      })
    })
  }
  getCount(name) {
    const date = this.getDate();
    return new Promise((resolve, reject) => {
      database.ref(`${date}/restaurants`).on('value', (data) => {
        data.forEach(data => {
          if (data.val().votes && data.val().restaurantName === name) {
            let count = Object.keys(data.val().votes).length;
            resolve(count);
          }
          if (!data.val().votes && data.val().restaurantName === name) {
            resolve(0)
          }
        })
      })
    })
  }
  getLeader() {
    let { restaurantsListWithCount } = this.state;
    const keys = Object.keys(restaurantsListWithCount)
    const largest = Math.max.apply(null, keys.map(x => restaurantsListWithCount[x]))
    const result = keys.reduce((result, key) => {
      if (largest > 0) {
        if (restaurantsListWithCount[key] === largest) {
          result.push(key);
        }
        return result;
      }
      return result;
    }, [])
    this.setState({
      leaders: result
    })
  }
  getDate() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    return `${month}${day}${year}`
  }
  render() {
    const { currentUser, restaurants, leaders } = this.state;
    return (
      <div className="Application">
        {!currentUser &&
          <div className="Application--HowItWorks">
            <h1 className="Application--title">What's For Lunch?</h1>
            <HowItWorks />
            <SignIn />
          </div>
        }
        {(currentUser && !restaurants) &&
          <div className="Application-SignedOn">
            <div className="Application--SignedOn--nav">
              <h1 className="Application--SignedOn--Logo">What's For Lunch?</h1>
              <CurrentUser user={currentUser} />
            </div>
            <div className="Application--SearchBar">
              <h3>Add a Restaurant to the voting queue</h3>
              <NewRestaurant getDate={() => this.getDate()} />
            </div>
          </div>
        }
        {(currentUser && restaurants) &&
          <div className="Application-SignedOn">
            <div className="Application--SignedOn--nav">
              <h1 className="Application--SignedOn--Logo">What's For Lunch?</h1>
              <CurrentUser user={currentUser} />
            </div>
            <div className="Application--SearchBar">
              <h3>Add a Restaurant to the voting queue</h3>
              <NewRestaurant getDate={() => this.getDate()} />
            </div>
            <div className="Application--Body">
              {/* <Leaderboard restaurants={restaurants} /> */}
              <Restaurants
                restaurants={restaurants} user={currentUser} getDate={() => this.getDate()}
                leaders={leaders}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;