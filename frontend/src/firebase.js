import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

// Everything related to user authentication and authorization is found here:
// https://www.youtube.com/watch?v=PKwu15ldZ7k&t=533s&ab_channel=WebDevSimplifiedWebDevSimplified

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const storage = app.storage();
export const auth = app.auth();
export default app;
