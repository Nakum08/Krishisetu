import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createUserProfile } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, email, fullName, photoURL } = route.params || {};
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    phone: '',
    userType: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.phone || !formData.userType) {
      Alert.alert(t('common.error'), t('completeProfile.fillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      await createUserProfile(user.uid, {
        fullName: fullName || 'User',
        email: email,
        phone: formData.phone,
        userType: formData.userType,
        photoURL: photoURL,
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      });

      await AsyncStorage.setItem('userToken', user.uid);
      await AsyncStorage.setItem('userType', formData.userType);

      Alert.alert(t('common.success'), t('completeProfile.profileCompleted'), [
        {
          text: t('common.ok'),
          onPress: () => {
            if (formData.userType === 'farmer') {
              navigation.replace('FarmerMain');
            } else if (formData.userType === 'customer') {
              navigation.replace('CustomerMain');
            }
          }
        }
      ]);
    } catch (error) {
      console.error('Profile completion error:', error);
      Alert.alert(t('common.error'), t('completeProfile.failedToComplete'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.header}>
          <Image
            source={require('../assets/farmersignin.jpeg')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>{t('completeProfile.completeYourProfile')} 🌿</Text>
            <Text style={styles.subtitle}>{t('completeProfile.fewMoreDetails')}</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.formCard}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('completeProfile.chooseYourRole')}</Text>
        <Text style={styles.sectionSubtitle}>{t('completeProfile.selectHowToUse')}</Text>

        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeCard,
              formData.userType === 'farmer' && styles.userTypeCardSelected
            ]}
            onPress={() => handleInputChange('userType', 'farmer')}
          >
            <Text style={styles.userTypeIcon}>👨‍🌾</Text>
            <Text style={styles.userTypeTitle}>{t('completeProfile.farmer')}</Text>
            <Text style={styles.userTypeDescription}>
              {t('completeProfile.farmerDescription')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeCard,
              formData.userType === 'customer' && styles.userTypeCardSelected
            ]}
            onPress={() => handleInputChange('userType', 'customer')}
          >
            <Text style={styles.userTypeIcon}>🛒</Text>
            <Text style={styles.userTypeTitle}>{t('completeProfile.customer')}</Text>
            <Text style={styles.userTypeDescription}>
              {t('completeProfile.customerDescription')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('completeProfile.contactInformation')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('completeProfile.mobileNumber')}
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>{t('completeProfile.completeProfile')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    height: s(400),
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: ms(24),
    borderBottomRightRadius: ms(24),
    backgroundColor: theme.colors.primary,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  title: {
    fontSize: ms(26),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: s(6),
  },
  subtitle: {
    fontSize: ms(15),
    color: '#f1f1f1',
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: '#fff',
    margin: s(20),
    borderRadius: ms(16),
    padding: s(20),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: s(20),
    paddingBottom: s(20),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userName: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  userEmail: {
    fontSize: ms(14),
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: ms(16),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: s(8),
  },
  sectionSubtitle: {
    fontSize: ms(14),
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
    backgroundColor: '#f8f9fa',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(25),
  },
  userTypeCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: ms(12),
    padding: s(20),
    alignItems: 'center',
    marginHorizontal: s(5),
    elevation: 2,
  },
  userTypeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#e8f5e8',
  },
  userTypeIcon: {
    fontSize: ms(32),
    marginBottom: s(8),
  },
  userTypeTitle: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  userTypeDescription: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: s(16),
    borderRadius: ms(8),
    alignItems: 'center',
    marginBottom: s(15),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  skipButton: {
    padding: s(12),
    alignItems: 'center',
  },
  skipButtonText: {
    color: theme.colors.primary,
    fontSize: ms(14),
  },
});

export default CompleteProfileScreen;
