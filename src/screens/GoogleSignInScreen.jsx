import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleSignInForm from '../components/GoogleSignInForm';
import { getUserProfile } from '../services/firestore';
import theme from '../theme';
import { useTranslation } from 'react-i18next';

const GoogleSignInScreen = ({ navigation }) => {
  const { t } = useTranslation();
  
  const handleGoogleLogin = async (user, userProfile) => {
    try {
      if (userProfile.userType === 'farmer') {
        navigation.replace('FarmerMain');
      } else if (userProfile.userType === 'customer') {
        navigation.replace('CustomerMain');
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert(t('common.error'), t('googleSignIn.failedToNavigate'));
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSignInForm handleGoogleLogin={handleGoogleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default GoogleSignInScreen;
