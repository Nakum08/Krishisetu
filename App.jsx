import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Ensure this is the correct path
import 'react-native-reanimated'
import 'react-native-gesture-handler';
import { PostsProvider } from './src/context/PostContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { initializeDatabaseWithStaticData } from './src/services/firestore'; // Disabled - database already initialized
import './src/i18n'; // Initialize i18n
const App = () => {
  useEffect(() => {
    // Configure Google Sign-In at app startup
    GoogleSignin.configure({
      webClientId: '191960386677-m6q2980b2stc3283je4r4qj69mm9sdoq.apps.googleusercontent.com',
      offlineAccess: false, // Disable offline access to avoid Firebase popup
      forceCodeForRefreshToken: false, // Disable refresh token to avoid Firebase popup
    });
    console.log('Google Sign-In configured at app startup');
    
    // Initialize database with static data (DISABLED - already seeded)
    // Only uncomment this if you need to reinitialize the database
    // initializeDatabaseWithStaticData()
    //   .then((count) => {
    //     if (count > 0) {
    //       console.log(`Database initialized with ${count} products`);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error initializing database:', error);
    //   });
  }, []);

  return (
    <LanguageProvider>
      <PostsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PostsProvider>
    </LanguageProvider>
  );
};

export default App;