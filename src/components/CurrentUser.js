import React from 'react';
import { auth } from '../firebase';
import './CurrentUser.css';

const CurrentUser = ({ user }) => {
	return (
		<div class="CurrentUser">
			<img
				className="CurrentUserPhoto"
				src={user.photoURL}
				alt={user.displayName}
			/>
			<div className="CurrentUserIdentification">
				<h2>{user.displayName}</h2>
				<button onClick={() => auth.signOut()}>Sign Out</button>
			</div>
		</div>
	)
}
export default CurrentUser;