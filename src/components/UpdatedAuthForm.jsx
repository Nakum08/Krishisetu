import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useFormik } from 'formik';
import { authValidationSchema } from '../validation/validationSchemas';
import theme from '../theme'; 
import { Picker } from '@react-native-picker/picker';

const UpdatedAuthForm = ({ handleRegistration, navigation }) => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/farmersignin.jpeg')} 
            style={styles.featureImage}
          />
        </View>

        <Text style={styles.title}>Create Your Account 🌿</Text>

        <View style={styles.formCard}>
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
              onValueChange={(itemValue) => formik.setFieldValue('userType', itemValue)}
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

          <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: theme.spacing.md,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: theme.spacing.sm,
  },
  featureImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontFamily: 'serif',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.textPrimary,
    backgroundColor: '#f0f0f0',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: theme.spacing.sm,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontSize: 14,
  },
});

export default UpdatedAuthForm;
