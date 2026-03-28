import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { resetLanguageSelection } from '../utils/languageUtils';

/**
 * Helper component for testing language selection flow
 * Add this to any screen temporarily to test the first-time user experience
 */
const LanguageTestHelper = () => {
  const handleResetLanguage = () => {
    Alert.alert(
      'Reset Language Selection',
      'This will reset the language selection and show the language selection screen on next app launch. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await resetLanguageSelection();
            Alert.alert('Success', 'Language selection has been reset. Restart the app to see the language selection screen.');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleResetLanguage}>
        <Text style={styles.buttonText}>Reset Language Selection (Testing)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LanguageTestHelper;
