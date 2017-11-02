import React, { Component } from 'react';
import Restaurant from './Restaurant';
import { database } from '../firebase';
import map from 'lodash/map';
import './Restaurants.css'

class Restaurants extends Component {
	handleSelect(key) {
		const currentUser = this.props.user;
		database.ref('/restaurants').child(key).child('votes').child(currentUser.uid).set(currentUser.displayName);
	}
	handleDeselect(key) {
		const currentUser = this.props.user;
		database.ref('/restaurants').child(key).child('votes').child(currentUser.uid).remove();
	}

	render() {
		const { restaurants, user } = this.props;
		return (
			<div className="Restaurants">
				{
					map(restaurants, (restaurant, key) => {
						return <Restaurant
							key={key}
							{...restaurant}
							user={user}
							handleSelect={() => this.handleSelect(key)}
							handleDeselect={() => this.handleDeselect(key)}
						/>
					})
				}
			</div>
		)
	}
}
export default Restaurants;