// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHDgyHcwLU-r8JkIBIYVczFTA2MXw23vk",
  authDomain: "jin-s-web.firebaseapp.com",
  projectId: "jin-s-web",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);