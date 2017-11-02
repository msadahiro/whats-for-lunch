import React, { Component } from 'react';
import { database } from '../firebase';
import './NewRestaurant.css';

class NewRestaurant extends Component {
	constructor() {
		super();
		this.state = {
			restaurantName: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.restaurantRef = database.ref('/restaurants');
	};
	handleSubmit(event) {
		event.preventDefault();
		this.restaurantRef.push({ restaurantName: this.state.restaurantName });
		this.setState({
			restaurantName: ''
		})
	}

	render() {
		const { restaurantName } = this.state;
		return (
			<form className="NewRestaurant">
				<input
					type="text"
					value={restaurantName}
					placeholder="Name of Restaurant"
					onChange={(event) => this.setState({ restaurantName: event.target.value })}
				/>
				<button
					onClick={this.handleSubmit}
					disabled={!restaurantName}
				>Submit</button>
			</form>
		)
	}
};
export default NewRestaurant;
