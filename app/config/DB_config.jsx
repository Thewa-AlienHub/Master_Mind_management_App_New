// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWfZqInTTohGn-F7Z7Kwb4L_RAwlMffPU",
  authDomain: "uee-project-mm.firebaseapp.com",
  projectId: "uee-project-mm",
  storageBucket: "uee-project-mm.appspot.com",
  messagingSenderId: "13111926717",
  appId: "1:13111926717:web:3dcff591dc21e8041efcd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const DB = getFirestore(app);
export const storage = getStorage(app);
export {
  addDoc,
  doc,
  ref,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  push,
  onValue,
  update,
  query,
  orderByChild,
  getDatabase,
  collection,
};
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  query,
  orderByChild,
} from "firebase/database";