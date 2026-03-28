import React, { useState, useRef, useEffect } from 'react';
import {
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ImageBackground,
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Animated, 
  Dimensions,
  Keyboard
} from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../validation/validationSchemas';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

const UpdatedLoginForm = ({ handleLogin }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  const onFocusField = (field) => {
    setFocusedField(field);
  };

  const onBlurField = () => {
    setFocusedField(null);
  };
  
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        if (focusedField === 'email' && emailInputRef.current) {
          scrollViewRef.current?.scrollTo({
            y: height * 0.35, 
            animated: true,
          });
        } else if (focusedField === 'password' && passwordInputRef.current) {
          scrollViewRef.current?.scrollTo({
            y: height * 0.42,
            animated: true,
          });
        }
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [focusedField]);

  return (
    <ScrollView 
      ref={scrollViewRef}
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
            <Text style={styles.title}>{t('login.welcomeBack')}</Text>

            <TextInput
              ref={emailInputRef}
              style={[
                styles.input, 
                focusedField === 'email' && styles.inputFocused,
                formik.touched.email && formik.errors.email && styles.inputError
              ]}
              placeholder={t('login.email')}
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={() => { onBlurField(); formik.handleBlur('email'); }}
              onFocus={() => onFocusField('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
            />
            {formik.touched.email && formik.errors.email &&
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            }

            <TextInput
              ref={passwordInputRef}
              style={[
                styles.input, 
                focusedField === 'password' && styles.inputFocused,
                formik.touched.password && formik.errors.password && styles.inputError
              ]}
              placeholder={t('login.password')}
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={() => { onBlurField(); formik.handleBlur('password'); }}
              onFocus={() => onFocusField('password')}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={formik.handleSubmit}
            />
            {formik.touched.password && formik.errors.password &&
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            }

                          <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={formik.handleSubmit}
            >
              <Text style={styles.buttonText}>{t('login.signIn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>{t('login.dontHaveAccount')} <Text style={styles.signUpHighlight}>{t('login.signUp')}</Text></Text>
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
    backgroundColor: '#fdfdfd',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  topHalf: {
    height: height * 0.35,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 18,
    paddingBottom:100
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    padding: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 13,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputFocused: {
    borderColor: '#81c784',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    fontSize: 12,
    color: '#e53935',
    marginBottom: 10,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordText: {
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
    fontWeight: '500',
  },
  signUpText: {
color: '#2e7d32',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
    fontWeight: '400',
  },
  signUpHighlight: {
    color: '#2e7d32',
    fontWeight: '600',
  }
});

export default UpdatedLoginForm;