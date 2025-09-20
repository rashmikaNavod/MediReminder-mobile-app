import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBUnoJ5DcNSp0n6sDxWCNtO1RIVCbH5q7M",
	authDomain: "medreminder-24a73.firebaseapp.com",
	projectId: "medreminder-24a73",
	storageBucket: "medreminder-24a73.firebasestorage.app",
	messagingSenderId: "648525372716",
	appId: "1:648525372716:web:989ab6868e37919d176089",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
