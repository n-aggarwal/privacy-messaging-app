import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgdTJ1kvbJlVmBF2OY4br205qmAGHRg7A",
  authDomain: "privacy-messaging-app.firebaseapp.com",
  projectId: "privacy-messaging-app",
  storageBucket: "privacy-messaging-app.appspot.com",
  messagingSenderId: "241953969003",
  appId: "1:241953969003:web:04f2bdf24bc622e26db22e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
