import React, { Component } from 'react';
import { auth, googleAuthProvider } from './../firebase';
import './SignIn.css'
class SignIn extends Component {
	render() {
		return (
			<div>
				<button className="SignInButton" onClick={() => auth.signInWithPopup(googleAuthProvider)}>Sign In With Gmail</button>
			</div>
		)
	}
}
export default SignIn;