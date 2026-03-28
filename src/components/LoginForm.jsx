import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { loginValidationSchema } from '../validation/validationSchemas';
import { login } from '../services/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const LoginForm = () => {
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const user = await login(values.email, values.password);
        if (user) {
          navigation.navigate('FarmerDashboard');
        }
      } catch (error) {
        Alert.alert('Login Error', error.message);
      }
    },
  });

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, formik.values.email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/login.jpg')} style={styles.featureImage} />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Please sign in to continue.</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {formik.errors.email && <Text style={styles.errorText}>{formik.errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        secureTextEntry
      />
      {formik.errors.password && <Text style={styles.errorText}>{formik.errors.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: s(20),
    justifyContent: 'center',
  },
  featureImage: {
    width: '100%',
    height: s(200),
    resizeMode: 'contain',
    marginBottom: s(20),
  },
  title: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: s(10),
  },
  subtitle: {
    fontSize: ms(16),
    color: theme.colors.textSecondary,
    marginBottom: s(20),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: s(15),
    borderRadius: ms(8),
    marginBottom: s(15),
    fontSize: ms(16),
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.secondary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: s(15),
    borderRadius: ms(8),
    marginBottom: s(15),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: ms(12),
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: s(10),
  },
});

export default LoginForm;