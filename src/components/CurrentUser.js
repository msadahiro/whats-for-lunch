import React from 'react';
import { auth } from '../firebase';
import './CurrentUser.css';

const CurrentUser = ({ user }) => {
	return (
		<div className="CurrentUser">
			<img
				className="CurrentUserPhoto"
				src={user.photoURL}
				alt={user.displayName}
			/>
			<div className="CurrentUserIdentification">
				<h4>{user.displayName}</h4>
				<button onClick={() => auth.signOut()}>Sign Out</button>
			</div>
		</div>
	)
}
export default CurrentUser;