import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-244ef.firebaseapp.com",
  projectId: "authexamnotes-244ef",
  storageBucket: "authexamnotes-244ef.firebasestorage.app",
  messagingSenderId: "1054436176555",
  appId: "1:1054436176555:web:540d1c7ba35a009d133dee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider;
export {auth,provider};