// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const StartFirebase = () => {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB7LhQE_gxnSPsDgMGmR-e28jKcLoB2Bb8",
    authDomain: "esp8266project-8e2a3.firebaseapp.com",
    databaseURL:
      "https://esp8266project-8e2a3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp8266project-8e2a3",
    storageBucket: "esp8266project-8e2a3.appspot.com",
    messagingSenderId: "21787903750",
    appId: "1:21787903750:web:499f3d025392419eb40087",
    measurementId: "G-Z3EVGBL3QC",
  };

  const app = initializeApp(firebaseConfig);
  return getDatabase(app);
};

export default StartFirebase;
