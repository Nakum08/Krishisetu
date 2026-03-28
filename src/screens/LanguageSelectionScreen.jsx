import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LanguageSelectionScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { changeLanguage, currentLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Ensure the selected language matches the current i18n language
  useEffect(() => {
    const currentLang = i18n.language || 'en';
    setSelectedLanguage(currentLang);
  }, [i18n.language]);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
    },
  ];

  // Get translated text based on current language
  const getTranslatedText = (key) => {
    const translations = {
      en: {
        welcomeTitle: 'Welcome to KrishiSetu',
        subtitle: 'Please select your preferred language',
        continue: 'Continue',
        appName: 'KrishiSetu'
      },
      gu: {
        welcomeTitle: 'કૃષિસેતુમાં આપનું સ્વાગત છે',
        subtitle: 'કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો',
        continue: 'ચાલુ રાખો',
        appName: 'કૃષિસેતુ'
      },
      hi: {
        welcomeTitle: 'कृषिसेतु में आपका स्वागत है',
        subtitle: 'कृपया अपनी पसंदीदा भाषा चुनें',
        continue: 'जारी रखें',
        appName: 'कृषिसेतु'
      }
    };
    
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  const handleLanguageSelect = async (languageCode) => {
    console.log('Language selected:', languageCode);
    setSelectedLanguage(languageCode);
    
    // Change language immediately for preview using i18n directly
    await i18n.changeLanguage(languageCode);
    console.log('i18n language changed to:', i18n.language);
    
    // Force a re-render by updating the context as well
    await changeLanguage(languageCode);
    
    // Force component re-render
    setForceUpdate(prev => prev + 1);
  };

  const handleContinue = async () => {
    // Also use the custom changeLanguage to update the context
    await changeLanguage(selectedLanguage);
    
    // Mark that user has completed language selection
    await AsyncStorage.setItem('hasSelectedLanguage', 'true');
    
    // Navigate to the main app
    navigation.replace('MainApp');
  };

  return (
    <SafeAreaView style={styles.container} key={forceUpdate}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>
            {getTranslatedText('welcomeTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {getTranslatedText('subtitle')}
          </Text>
        </View>

        {/* Language Options */}
        <View style={styles.languageContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                selectedLanguage === language.code && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLanguage(language.code)}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageText}>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === language.code && styles.selectedText
                  ]}>
                    {language.nativeName}
                  </Text>
                  <Text style={[
                    styles.languageEnglish,
                    selectedLanguage === language.code && styles.selectedSubText
                  ]}>
                    {language.name}
                  </Text>
                </View>
              </View>
              {selectedLanguage === language.code && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {getTranslatedText('continue')}
          </Text>
        </TouchableOpacity>

        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🌾</Text>
          <Text style={styles.appName}>
            {getTranslatedText('appName')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  languageContainer: {
    marginVertical: 40,
  },
  languageOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  languageEnglish: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedText: {
    color: '#2E7D32',
  },
  selectedSubText: {
    color: '#4CAF50',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default LanguageSelectionScreen;
