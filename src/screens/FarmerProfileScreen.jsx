import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, Linking, ScrollView, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getAuth } from 'firebase/auth';
import { getUserProfile } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOutUser } from '../services/googleAuth';
import UnifiedHeader from '../components/UnifiedHeader';
import LanguageSelector from '../components/LanguageSelector';
import LinearGradient from 'react-native-linear-gradient';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const getRandomAvatarGradient = () => {
    const gradients = [
    ['#558B2F', '#8BC34A'], // Green
    ['#2E7D32', '#4CAF50'], // Deep Green
    ['#1B5E20', '#43A047'], // Forest Green
    ['#689F38', '#AED581'], // Light Green
    ['#33691E', '#7CB342'], // Olive Green
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const FarmerProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = getAuth();
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [avatarGradient, setAvatarGradient] = useState(getRandomAvatarGradient());

  useEffect(() => {
    (async () => {
      try {
        // First try to get user token from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('FarmerProfile - User token from AsyncStorage:', userToken);
        
        if (userToken) {
          // Get user data from Firestore using the token as user ID
          const profile = await getUserProfile(userToken);
          console.log('FarmerProfile - User data from Firestore:', profile);
          
          if (profile) {
            if (profile.fullName) setFullName(profile.fullName);
            if (profile.photoURL) setUserPhoto(profile.photoURL);
          }
        } else {
          // Fallback to Firebase Auth if no token in AsyncStorage
          const user = auth.currentUser;
          if (!user) return;
          const profile = await getUserProfile(user.uid);
          if (profile.fullName) setFullName(profile.fullName);
          if (profile.photoURL) setUserPhoto(profile.photoURL);
        }
      } catch (e) {
        console.warn('Could not load profile', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!fullName) return;
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length >= 2) {
      const first = nameParts[0]?.charAt(0) || '';
      const last = nameParts[nameParts.length - 1]?.charAt(0) || '';
      setInitials((first + last).toUpperCase());
    } else if (nameParts.length === 1) {
      setInitials(nameParts[0]?.charAt(0)?.toUpperCase() || '');
    }
    setAvatarGradient(getRandomAvatarGradient());
  }, [fullName]);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.ok'), 
          onPress: () => signOutUser(navigation)
        },
      ],
      { cancelable: true }
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: t('profile.shareMessage') });
    } catch {
      Alert.alert(t('common.error'), 'Could not share right now.');
    }
  };

  const handleAddPost = () => {
    navigation.navigate('AddPostScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <UnifiedHeader
          title={t('profile.title')}
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CustomerCartScreen')}
          showMenuButton={false}
        />
        
        {/* ScrollView for all content below the header */}
        <ScrollView 
          style={styles.scrollViewContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {userPhoto ? (
                <Image 
                  source={{ uri: userPhoto }} 
                  style={styles.profileImage}
                />
              ) : (
                <LinearGradient 
                  colors={avatarGradient} 
                  style={styles.avatarGradient}
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 1}}
                >
                  <Text style={styles.initials}>{initials || 'C'}</Text>
                </LinearGradient>
              )}
            </View>
            <Text style={styles.profileName}>{fullName || t('profile.farmer')}</Text>
          </View>

          {/* Add Post Button */}
          <TouchableOpacity style={styles.addPostButton} onPress={handleAddPost}>
            <LinearGradient
              colors={['#4A6D3E', '#75A562']}
              style={styles.addPostGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Icon name="add-outline" size={22} color="#FFF" />
              <Text style={styles.addPostText}>{t('profile.addPost')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <LanguageSelector />
            <Option 
              icon="lock-closed-outline"
              label={t('profile.privacyPolicy')}
              onPress={() => Linking.openURL('https://srushtiinfotech.netlify.app/')}
            />
            <Option 
              icon="information-circle-outline" 
              label={t('profile.aboutUs')} 
              onPress={() => navigation.navigate('AboutUsScreen')}
            />
            <Option 
              icon="share-social-outline" 
              label={t('profile.shareApp')} 
              onPress={handleShare} 
            />
            <Option 
              icon="log-out-outline" 
              label={t('profile.logout')} 
              onPress={handleLogout} 
              isLast={true}
            />
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const Option = ({ icon, label, onPress, isLast = false }) => (
  <TouchableOpacity 
    style={[styles.optionRow, !isLast && styles.optionBorder]} 
    onPress={onPress}
  >
    <View style={styles.iconBackground}>
      <Icon name={icon} size={22} color="#4A6D3E" />
    </View>
    <Text style={styles.optionText}>{label}</Text>
    <View style={styles.chevronContainer}>
      <Icon name="chevron-forward" size={16} color="#888" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F8F0',
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: s(24),
    paddingBottom: s(36), 
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: s(30),
    paddingHorizontal: s(20),
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(4) },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarContainer: {
    marginBottom: s(16),
  },
  profileImage: {
    width: s(100),
    height: s(100),
    borderRadius: ms(50),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(3) },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  avatarGradient: {
    width: s(100),
    height: s(100),
    borderRadius: ms(50),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(3) },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  initials: {
    fontSize: ms(38),
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: s(0), height: s(1) },
    textShadowRadius: 2,
  },
  profileName: {
    fontSize: ms(24),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  addPostButton: {
    marginTop: s(16),
    marginBottom: s(8),
    borderRadius: ms(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addPostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(12),
  },
  addPostText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: '600',
    marginLeft: s(8),
  },
  optionsContainer: {
    marginTop: s(16),
    backgroundColor: '#FFF',
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(16),
    paddingHorizontal: s(18),
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  iconBackground: {
    width: s(42),
    height: s(42),
    borderRadius: ms(12),
    backgroundColor: '#F0F8EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(16),
  },
  optionText: {
    flex: 1,
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
  },
  chevronContainer: {
    width: s(28),
    height: s(28),
    borderRadius: ms(14),
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: s(50), 
  }
});

export default FarmerProfileScreen;