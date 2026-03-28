import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reset language selection - useful for testing
 * This will make the app show language selection screen again
 */
export const resetLanguageSelection = async () => {
  try {
    await AsyncStorage.removeItem('hasSelectedLanguage');
    console.log('Language selection reset - app will show language selection on next launch');
  } catch (error) {
    console.error('Error resetting language selection:', error);
  }
};

/**
 * Check if user has selected language
 */
export const hasUserSelectedLanguage = async () => {
  try {
    const hasSelected = await AsyncStorage.getItem('hasSelectedLanguage');
    return hasSelected === 'true';
  } catch (error) {
    console.error('Error checking language selection:', error);
    return false;
  }
};

/**
 * Mark that user has completed language selection
 */
export const markLanguageSelected = async () => {
  try {
    await AsyncStorage.setItem('hasSelectedLanguage', 'true');
  } catch (error) {
    console.error('Error marking language as selected:', error);
  }
};
