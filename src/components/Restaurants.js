import React, { Component } from 'react';
import Restaurant from './Restaurant';
import { database } from '../firebase';
import map from 'lodash/map';
import './Restaurants.css'

class Restaurants extends Component {
	handleSelect(key) {
		const date = this.props.getDate()
		const currentUser = this.props.user;
		database.ref(`${date}/restaurants`).child(key).child('votes').child(currentUser.uid).set(currentUser.displayName);
	}
	handleDeselect(key) {
		const date = this.props.getDate();
		const currentUser = this.props.user;
		database.ref(`${date}/restaurants`).child(key).child('votes').child(currentUser.uid).remove();
	}
	render() {
		const { restaurants, user, leaders } = this.props;
		return (
			<div className="Restaurant--Container">
				<h2 className="currentLunch">Current Lunch Options:</h2>
				<div className="Restaurants">
					{
						map(restaurants, (restaurant, key) => {

							return <Restaurant
								key={key}
								{...restaurant}
								user={user}
								handleSelect={() => this.handleSelect(key)}
								handleDeselect={() => this.handleDeselect(key)}
								leaders={leaders.includes(restaurant.restaurantName)}
							/>
						})
					}
				</div>
			</div>
		)
	}
}
export default Restaurants;