import React from 'react';
import { ScrollView, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import { register } from '../services/auth';
import { createUserProfile } from '../services/firestore';
import { useIsFocused } from '@react-navigation/native';
import UpdatedAuthForm from '../components/UpdatedAuthForm';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const AuthScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const handleRegistration = async (values) => {
    try {
      const user = await register(values.email, values.password);
      
      await createUserProfile(user.uid, {
        fullName: values.fullName,
        email: values.email,
        userType: values.userType,
        phone: values.phone,
        createdAt: new Date().toISOString(),
      });

      if (isFocused) {
        Alert.alert('Success', 'Registration successful!');
      }

      if (values.userType === 'farmer') {
        navigation.navigate('FarmerDashboard');
      } else if (values.userType === 'customer') {
        navigation.navigate('CustomerDashboard');
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (isFocused) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: s(20) }}>
      {/* <AuthForm
        handleRegistration={handleRegistration}
        navigation={navigation}
      /> */}

      <UpdatedAuthForm
      handleRegistration={handleRegistration}
      navigation={navigation}/>
    </ScrollView>
  );
};

export default AuthScreen;