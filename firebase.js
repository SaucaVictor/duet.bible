import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAtTlD7wToiGcMNV_57W13gJxc1j-82aSI",
  authDomain: "duetbible.firebaseapp.com",
  projectId: "duetbible",
  storageBucket: "duetbible.firebasestorage.app",
  messagingSenderId: "626988187091",
  appId: "1:626988187091:web:43f925d5a77e4465914326",
  measurementId: "G-M28GQTGKMJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db, app };