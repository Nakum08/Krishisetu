import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginForm from '../components/UpdatedLoginForm';
import { login } from '../services/auth';
import { getUserProfile } from '../services/firestore';
import theme from '../theme';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const LoginScreen = ({ navigation }) => {
  const handleLogin = async (values) => {
    if (!values.email || !values.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const user = await login(values.email, values.password);
      const userData = await getUserProfile(user.uid);
      if (userData) {
        await AsyncStorage.setItem('userToken', user.uid);
        await AsyncStorage.setItem('userType', userData.userType);
        if (userData.userType === 'farmer') {
          navigation.replace('FarmerMain');
        } else if (userData.userType === 'customer') {
          navigation.replace('CustomerMain');
        }
      } else {
        Alert.alert(t('common.error'), t('login.userDataNotFound'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm handleLogin={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default LoginScreen;
