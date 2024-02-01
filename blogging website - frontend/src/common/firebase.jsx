import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
	apiKey: "AIzaSyBYHWB5WXaPTQQ5o3fu3iGmeNERql6SdH8",
	authDomain: "mernblog-c2dd2.firebaseapp.com",
	projectId: "mernblog-c2dd2",
	storageBucket: "mernblog-c2dd2.appspot.com",
	messagingSenderId: "2953785640",
	appId: "1:2953785640:web:49a903a786e083d7aea01d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// * Google Auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
	let user = null;
	await signInWithPopup(auth, provider)
		.then((result) => {
			user = result.user;
		})
		.catch((err) => {
			console.log(err);
		});
	return user;
};
