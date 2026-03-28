import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithGoogle } from '../services/googleAuth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createUserProfile, getUserProfile } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';


const { height } = Dimensions.get('window');

const GoogleSignInForm = ({ handleGoogleLogin }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google Sign-In...');
      
      // Get Google Sign-In result directly (this will show native Google account picker)
      const signInResult = await GoogleSignin.signIn();
      console.log('Google Sign-In result:', signInResult);
      console.log('Sign-In result type:', typeof signInResult);
      console.log('Sign-In result keys:', Object.keys(signInResult));
      
      // Log the full structure to understand what we're getting
      if (signInResult) {
        console.log('Full sign-in result structure:', JSON.stringify(signInResult, null, 2));
      }
      
      // Extract user data from the sign-in result - try multiple possible structures
      let userData = null;
      
      if (signInResult && signInResult.user) {
        userData = signInResult.user;
        console.log('Found user data in signInResult.user');
      } else if (signInResult && signInResult.data && signInResult.data.user) {
        userData = signInResult.data.user;
        console.log('Found user data in signInResult.data.user');
      } else if (signInResult && signInResult.data) {
        userData = signInResult.data;
        console.log('Found user data in signInResult.data');
      } else if (signInResult && signInResult.email) {
        userData = signInResult;
        console.log('Found user data directly in signInResult');
      }
      
      console.log('User data extracted:', userData);
      
      if (!userData || !userData.email) {
        console.error('No valid user data found in sign-in result:', signInResult);
        console.error('Available keys in signInResult:', Object.keys(signInResult || {}));
        
        // Try to get current user as fallback
        try {
          console.log('Trying to get current user as fallback...');
          const currentUser = await GoogleSignin.getCurrentUser();
          console.log('Current user from getCurrentUser:', currentUser);
          
          if (currentUser && currentUser.user) {
            userData = currentUser.user;
            console.log('Using current user data as fallback');
          } else if (currentUser && currentUser.email) {
            userData = currentUser;
            console.log('Using current user data directly as fallback');
          }
        } catch (fallbackError) {
          console.error('Fallback getCurrentUser also failed:', fallbackError);
        }
        
        if (!userData || !userData.email) {
          throw new Error('Failed to get user data from Google Sign-In');
        }
      }
      
      // Create user object from Google Sign-In result
      const user = {
        uid: userData.id || `google_${Date.now()}`,
        email: userData.email,
        displayName: userData.name || userData.displayName || 'Google User',
        photoURL: userData.photo || userData.photoURL || null
      };
      
      console.log('Using user data:', user);
      
      if (user) {
        try {
          // Check if user profile already exists
          const existingProfile = await getUserProfile(user.uid);
          console.log('Existing profile:', existingProfile);
          
          if (existingProfile) {
            // User exists, proceed with login
            await AsyncStorage.setItem('userToken', user.uid);
            await AsyncStorage.setItem('userType', existingProfile.userType);
            
            if (handleGoogleLogin) {
              handleGoogleLogin(user, existingProfile); 
            } else {
              // Default navigation based on user type
              if (existingProfile.userType === 'farmer') {
                navigation.replace('FarmerMain');
              } else if (existingProfile.userType === 'customer') {
                navigation.replace('CustomerMain');
              }
            }
          } else {
            // New user, navigate to profile completion
            console.log('Navigating to CompleteProfile with user data:', {
              email: user.email,
              fullName: user.displayName
            });
            navigation.navigate('CompleteProfile', { 
              user: user,
              email: user.email,
              fullName: user.displayName,
              photoURL: user.photoURL
            });
          }
        } catch (profileError) {
          console.error('Profile check error:', profileError);
          // If profile check fails, treat as new user
          navigation.navigate('CompleteProfile', { 
            user: user,
            email: user.email,
            fullName: user.displayName,
            photoURL: user.photoURL
          });
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        switch (error.code) {
          case 'SIGN_IN_CANCELLED':
            errorMessage = 'Sign-in was cancelled.';
            break;
          case 'PLAY_SERVICES_NOT_AVAILABLE':
            errorMessage = 'Google Play Services is not available on this device.';
            break;
          default:
            errorMessage = `Sign-in error: ${error.code}`;
        }
      }
      
      Alert.alert('Sign-In Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.mainContainer} 
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 30}
      >
        <View style={styles.topHalf}>
          <ImageBackground
            source={require('../assets/farmerbg.jpeg')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bottomHalf}>
          <View style={styles.card}>
            <Text style={styles.title}>{t('googleSignIn.welcomeTitle')}</Text>
            <Text style={styles.subtitle}>{t('googleSignIn.subtitle')}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#81C784', '#388E3C', '#1B5E20']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.googleButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.googleButtonText}>{t('googleSignIn.continueWithGoogle')}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('googleSignIn.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.linkText}>{t('googleSignIn.createAccountWithEmail')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>{t('googleSignIn.signInWithEmail')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  topHalf: {
    height: height * 0.4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
  },
  card: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  googleButton: {
    borderRadius: 120,
    overflow: 'hidden', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  linkButton: {
    paddingVertical: 12,
    marginBottom: 10,
  },
  linkText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GoogleSignInForm;
