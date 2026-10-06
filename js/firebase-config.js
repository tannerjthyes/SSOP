import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2BbPjZ5mUeRd6iwulgmD9K3pajnSBLLk",
  authDomain: "ssop-7f19f.firebaseapp.com",
  projectId: "ssop-7f19f",
  storageBucket: "ssop-7f19f.firebasestorage.app",
  messagingSenderId: "976507026725",
  appId: "1:976507026725:web:6dbcd7f8019bac1de46ecc",
  measurementId: "G-NZ0MLYJGCV",
  databaseURL: "https://ssop-7f19f-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
