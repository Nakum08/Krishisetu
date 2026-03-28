import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBFIpKNFF56ts3djmim4ENVtFb0NMM9IuE",
  authDomain: "krishisetu-5b96a.firebaseapp.com",
  projectId: "krishisetu-5b96a",
  // storageBucket: "krishisetu-5b96a.appspot.com",
  storageBucket: "earnpaisa-a7d55.firebasestorage.app",
  messagingSenderId: "315402135317",
  appId: "1:191960386677:android:f7db6a1e94e3564909fc3c"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth };
