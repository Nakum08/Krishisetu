import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './firestore';

// Google Sign-In is now configured at app startup in App.jsx

export const signInWithGoogle = async () => {
  try {
    console.log('Checking Google Play Services...');
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices();
    console.log('Google Play Services available');
    
    console.log('Starting Google Sign-In...');
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    console.log('Google Sign-In result:', signInResult);
    
    if (!signInResult || !signInResult.idToken) {
      throw new Error('Failed to get ID token from Google Sign-In');
    }
    
    const { idToken } = signInResult;
    console.log('Got ID token from Google');
    
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    console.log('Created Google credential');
    
    // Sign-in the user with the credential
    const userCredential = await signInWithCredential(auth, googleCredential);
    console.log('Firebase sign-in successful:', userCredential.user.email);
    
    return userCredential.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    
    // Provide helpful error messages
    if (error.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Sign-in was cancelled by the user');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      throw new Error('Google Play Services is not available on this device');
    } else if (error.code === 'INVALID_ACCOUNT') {
      throw new Error('Invalid Google account');
    } else if (error.code === 'auth/argument-error') {
      throw new Error('Invalid authentication credentials. Please try again.');
    } else {
      throw new Error(`Failed to sign in with Google: ${error.message || error.code || 'Unknown error'}`);
    }
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
};

// Centralized sign-out function that handles both Google and local storage
export const signOutUser = async (navigation) => {
  try {
    // Sign out from Google
    await signOutFromGoogle();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    // Continue with local cleanup even if Google sign-out fails
  }
  
  try {
    // Clear AsyncStorage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userType');
    
    // Navigate to Google Sign-In screen
    if (navigation) {
      navigation.replace('GoogleSignIn');
    }
  } catch (error) {
    console.error('Local storage cleanup error:', error);
    // Try to navigate even if storage cleanup fails
    if (navigation) {
      navigation.replace('GoogleSignIn');
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error) {
    console.error('Get Current User Error:', error);
    return null;
  }
};

export const isSignedIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return isSignedIn;
  } catch (error) {
    console.error('Is Signed In Error:', error);
    return false;
  }
};


