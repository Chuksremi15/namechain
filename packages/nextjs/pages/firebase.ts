// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJhC-Tk9MtG5Pln2505Sa4FHw8T_zRHc0",
  authDomain: "onchainens.firebaseapp.com",
  projectId: "onchainens",
  storageBucket: "onchainens.appspot.com",
  messagingSenderId: "707447209403",
  appId: "1:707447209403:web:b444b3dea7020d2561589e",
  measurementId: "G-H24YE2E8R0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
