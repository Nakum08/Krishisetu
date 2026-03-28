import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; 
export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

// export const resetPassword = async (email) => {
//   try {
//     await sendPasswordResetEmail(auth, email);
//   } catch (error) {
//     throw error;
//   }
// };



export const resetPassword = async (email) => {
  try {
    console.log(`Attempting to send password reset to: ${email}`);
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending password reset:', error.code, error.message);
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account exists with this email address');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later');
    } else {
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }
};