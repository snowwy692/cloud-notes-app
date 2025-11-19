// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3dD8XN9didwj01ppG_as4FGm_jUhSfGQ",
  authDomain: "cloud-notes-app-9e226.firebaseapp.com",
  projectId: "cloud-notes-app-9e226",
  storageBucket: "cloud-notes-app-9e226.app",
  messagingSenderId: "18340415216",
  appId: "1:18340415216:web:6f0a61e40b7ae2689c2435",
  measurementId: "G-0L77P5NS3X"
};

// Initialize Firebase (compat)
firebase.initializeApp(firebaseConfig);

// Create global auth & db objects
const auth = firebase.auth();
const db = firebase.firestore();
