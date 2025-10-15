// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "mern-stack-ad653.firebaseapp.com",
//   projectId: "mern-stack-ad653",
//   storageBucket: 'mern-estate.appspot.com',
//   messagingSenderId: "84526537135",
//   appId: "1:84526537135:web:0c363888d3cc310b7cb75a"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// export default app; 
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// export const storage = getStorage(app);



// firebase.js

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvEXAMPLE_REAL_KEY",
  authDomain: "mern-stack-ad653.firebaseapp.com",
  projectId: "mern-stack-ad653",
  storageBucket: "mern-estate.appspot.com",
  messagingSenderId: "84526537135",
  appId: "1:84526537135:web:0c363888d3cc310b7cb75a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;  
