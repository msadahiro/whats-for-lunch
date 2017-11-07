import React, { Component } from 'react';
import { database } from '../firebase';
import './Leaderboard.css';

class Leaderboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			restaurantListsWithCount: {},
		}
	}
	componentDidMount() {
		this.getrestaurantListsWithCount();
	}
	getDate() {
		const year = new Date().getFullYear()
		const month = new Date().getMonth() + 1
		const day = new Date().getDate()
		return `${month}${day}${year}`
	}
	getrestaurantListsWithCount() {
		const date = this.getDate()
		const { restaurantListsWithCount } = this.state;
		database.ref(`${date}/restaurants`).on('value', (data) => {
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
		const date = this.getDate()
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
	renderLeader() {
		const keys = Object.keys(this.state.restaurantListsWithCount)
		const largest = Math.max.apply(null, keys.map(x => this.state.restaurantListsWithCount[x]))
		const result = keys.reduce((result, key) => {
			if (this.state.restaurantListsWithCount[key] === largest) {
				result.push(key)
			}
			return result;
		}, [])
		if (result.length > 0 && largest > 0) {
			return (
				<h1>Current Leader: {result.join(" & ")}</h1>
			)
		} else {
			return (
				<div></div>
			)
		}
	}
	render() {
		if (!this.state.restaurantListsWithCount) {
			return <div>Loading</div>
		}
		return (
			<div className="Leaderboard--Header">
				{this.renderLeader()}
			</div>
		)
	}
}
export default Leaderboard;