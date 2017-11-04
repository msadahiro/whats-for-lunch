import React, { Component } from 'react';
import { database } from '../firebase';

class Leaderboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			restaurantListsWithCount: {},
		}
	}
	componentWillMount() {
		this.getRestaurantName();
	}
	getRestaurantName() {
		const { restaurantListsWithCount } = this.state;
		database.ref('/restaurants').on('value', (data) => {
			data.forEach(data => {
				let name = data.val().restaurantName
				this.getCount(name).then((resultCount) => {
					if (restaurantListsWithCount[data.val().restaurantName] === undefined) {
						const newRestaurantListsWithCount = { ...this.state.restaurantListsWithCount }
						newRestaurantListsWithCount[data.val().restaurantName] = resultCount;
						this.setState({
							restaurantListsWithCount: newRestaurantListsWithCount
						})
					}
				})
			})
		})
	}
	getCount(name) {
		// do async things in promise
		return new Promise((resolve, reject) => {
			database.ref(`/restaurants`).on('value', (data) => {
				data.forEach(data => {
					if (data.val().votes && data.val().restaurantName === name) {
						let count = Object.keys(data.val().votes).length;
						resolve(count);
					}
				})
			})
		})
	}
	renderLeader() {
		let currentLeader = Object.keys(this.state.restaurantListsWithCount).reduce((a, b) => {
			return this.state.restaurantListsWithCount[a] > this.state.restaurantListsWithCount[b] ? a : b
		}, "");
		return (
			<h1>{currentLeader}</h1>
		)
	}
	render() {
		if (!this.state.restaurantListsWithCount && !this.props.restaurants) {
			return <div>Loading</div>
		}
		return (
			<div>
				{this.renderLeader()}
			</div>
		)
	}
}
export default Leaderboard;