// Import the functions you need from the SDKs you want to use
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "lbs2025.firebaseapp.com",
  projectId: "lbs2025",
  storageBucket: "lbs2025.appspot.com",
  messagingSenderId: "481220144121",
  appId: "YOUR_APP_ID" // This needs to be obtained from Firebase Console if specific app is created
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

export { app, db, storage }; // Export storage
