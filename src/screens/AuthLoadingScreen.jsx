import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';

const AuthLoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check if user has selected language
        const hasSelectedLanguage = await AsyncStorage.getItem('hasSelectedLanguage');
        
        if (!hasSelectedLanguage) {
          // First time user - show language selection
          navigation.replace('LanguageSelection');
          return;
        }

        // Check if user is logged in
        const userToken = await AsyncStorage.getItem('userToken');
        const userType = await AsyncStorage.getItem('userType');
        
        if (userToken && userType) {
          if (userType === 'farmer') {
            navigation.replace('FarmerMain');
          } else {
            navigation.replace('CustomerMain');
          }
        } else {
          navigation.replace('GoogleSignIn');
        }
      } catch (error) {
        // If error, show language selection as fallback
        navigation.replace('LanguageSelection');
      }
    };
    checkUser();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingScreen;
