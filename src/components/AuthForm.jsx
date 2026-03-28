import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useFormik } from 'formik';
import { authValidationSchema } from '../validation/validationSchemas';
import theme from '../theme'; 
import { Picker } from '@react-native-picker/picker'; 
import { s, ms, wp, hp, vs } from '../utils/responsive';

const AuthForm = ({ handleRegistration, navigation }) => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      userType: '',
    },
    validationSchema: authValidationSchema,
    onSubmit: (values) => {
      handleRegistration(values);
    },
  });

  return (
    <View style={styles.container}>
      <Image source={require('../assets/register.jpg')} style={styles.featureImage} />
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Please register to login.</Text>
      
      <TextInput
        style={[styles.input, formik.touched.fullName && formik.errors.fullName && styles.inputError]}
        placeholder="Full Name"
        value={formik.values.fullName}
        onChangeText={formik.handleChange('fullName')}
        onBlur={formik.handleBlur('fullName')}
      />
      {formik.touched.fullName && formik.errors.fullName && 
        <Text style={styles.errorText}>{formik.errors.fullName}</Text>
      }

      <TextInput
        style={[styles.input, formik.touched.email && formik.errors.email && styles.inputError]}
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {formik.touched.email && formik.errors.email && 
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      }

      <TextInput
        style={[styles.input, formik.touched.password && formik.errors.password && styles.inputError]}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
      />
      {formik.touched.password && formik.errors.password && 
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      }

      <TextInput
        style={[styles.input, formik.touched.confirmPassword && formik.errors.confirmPassword && styles.inputError]}
        placeholder="Confirm Password"
        value={formik.values.confirmPassword}
        onChangeText={formik.handleChange('confirmPassword')}
        onBlur={formik.handleBlur('confirmPassword')}
        secureTextEntry
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && 
        <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
      }

      <TextInput
        style={[styles.input, formik.touched.phone && formik.errors.phone && styles.inputError]}
        placeholder="Mobile Number"
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        keyboardType="phone-pad"
      />
      {formik.touched.phone && formik.errors.phone && 
        <Text style={styles.errorText}>{formik.errors.phone}</Text>
      }

      <View style={[styles.pickerContainer, formik.touched.userType && formik.errors.userType && styles.inputError]}>
        <Picker
          selectedValue={formik.values.userType}
          onValueChange={(itemValue) => {
            formik.setFieldValue('userType', itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select User Type" value="" />
          <Picker.Item label="Farmer" value="farmer" />
          <Picker.Item label="Customer" value="customer" />
        </Picker>
      </View>
      {formik.touched.userType && formik.errors.userType && 
        <Text style={styles.errorText}>{formik.errors.userType}</Text>
      }

      <TouchableOpacity 
        style={styles.button} 
        onPress={formik.handleSubmit}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthForm;

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
  picker: {
    height: s(50),
    width: '100%',
    marginBottom: s(15),
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
  label: {
    fontSize: ms(16),
    color: theme.colors.textPrimary,
    marginBottom: s(5),
  },

  inputError: {
    borderColor: theme.colors.error,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: ms(8),
    marginBottom: s(15),
    backgroundColor: theme.colors.secondary,
  },

});