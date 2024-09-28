
import { auth } from "../databases/firebase.config";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";

export async function registerUser(email: string, password: string) {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up
			const user = userCredential.user;
			return user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("error creating user: ", errorCode, errorMessage);
		});
}

export async function login(email: string, password: string) {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			return user
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("error logging in user: ", errorCode, errorMessage);
		});
}

export async function logout() {
	signOut(auth)
		.then(() => {
			// Sign-out successful
			console.log("user Logged Out");
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("error logging in user: ", errorCode, errorMessage);
		});
}