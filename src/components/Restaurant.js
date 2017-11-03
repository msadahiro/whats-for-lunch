import React, { Component } from 'react';
import map from 'lodash/map';
import './Restaurant.css';

class Restaurant extends Component {
	render() {
		const { restaurantName, votes, user, handleSelect, handleDeselect } = this.props;
		const userHasSelected = votes && Object.keys(votes).includes(user.uid);
		return (
			<article className="Restaurant">
				<h3>{restaurantName}</h3>
				<ul>
					{
						votes && map(votes, (vote, key) => <li className="listItem" key={key}>{vote}</li>)
					}
				</ul>
				{
					userHasSelected
						? <button className="remove" onClick={handleDeselect}>Nah, Nevermind</button>
						: <button className="select" onClick={handleSelect}>Yeah, I'd go there</button>
				}
			</article>
		)
	}
}
export default Restaurant;