import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";        // ← ADD THIS
 
 // from src/ directly

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-YhTXq1BDgZAAuLl5fovuMmZwYmxf5k0",
  authDomain: "cityclean-53ccc.firebaseapp.com",
  projectId: "cityclean-53ccc",
  storageBucket: "cityclean-53ccc.firebasestorage.app",
  messagingSenderId: "352717868576",
  appId: "1:352717868576:web:9324b6916838325f2e3645",
  measurementId: "G-1CJVXRPC2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage  = getStorage(app);             // ← ADD THIS
export const db       = getFirestore(app); // remove if not needed

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export { provider };



