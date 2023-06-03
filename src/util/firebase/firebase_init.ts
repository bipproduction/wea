// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfACNHRoyIvX4nct4juVabZDgwEDKQ6jY",
    authDomain: "malikkurosaki1985.firebaseapp.com",
    databaseURL: "https://malikkurosaki1985.firebaseio.com",
    projectId: "malikkurosaki1985",
    storageBucket: "malikkurosaki1985.appspot.com",
    messagingSenderId: "27222609089",
    appId: "1:27222609089:web:4d56217dae0991b0da9840"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);