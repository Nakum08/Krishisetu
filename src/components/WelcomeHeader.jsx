import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../services/firebase';
import { getUserProfile } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WelcomeHeader = ({ 
  userType = 'customer', // 'customer' or 'farmer'
  onWishlistPress,
  onCartPress,
  onAddProductPress,
  onAddPostPress 
}) => {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Set the appropriate greeting based on time of day
    const hours = new Date().getHours();
    let greetingText = 'Welcome';
    if (hours < 12) greetingText = 'Good Morning';
    else if (hours < 18) greetingText = 'Good Afternoon';
    else greetingText = 'Good Evening';
    setGreeting(greetingText);

    // Fetch user data
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // First try to get user token from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('User token from AsyncStorage:', userToken);
        
        if (userToken) {
          // Get user data from Firestore using the token as user ID
          console.log('Fetching from Firestore with token:', userToken);
          const userData = await getUserProfile(userToken);
          console.log('User data from Firestore:', userData);
          
          if (userData) {
            // Use fullName or name or firstName + lastName as available
            const fullName = userData.fullName || 
                             userData.name || 
                            (userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : '');
            
            console.log('Setting fullName:', fullName);
            console.log('Setting photoURL:', userData.photoURL);
            
            if (fullName) {
              setUserName(fullName);
            }
            
            if (userData.photoURL) {
              setUserPhoto(userData.photoURL);
            }
          }
        } else {
          // Fallback to Firebase Auth if no token in AsyncStorage
          const auth = getAuth(app);
          const currentUser = auth.currentUser;
          
          console.log('No token in AsyncStorage, trying Firebase Auth. Current user:', currentUser?.uid);
          
          if (currentUser) {
            // First try to get display name from auth
            if (currentUser.displayName) {
              console.log('Using auth displayName:', currentUser.displayName);
              console.log('Using auth photoURL:', currentUser.photoURL);
              setUserName(currentUser.displayName);
              setUserPhoto(currentUser.photoURL);
            } else {
              // If not available, try to get from Firestore
              console.log('Fetching from Firestore...');
              const userData = await getUserProfile(currentUser.uid);
              console.log('User data from Firestore:', userData);
              
              if (userData) {
                const fullName = userData.fullName || 
                                 userData.name || 
                                (userData.firstName ? `${userData.firstName} ${userData.lastName || ''}` : '');
                
                console.log('Setting fullName:', fullName);
                console.log('Setting photoURL:', userData.photoURL);
                
                if (fullName) {
                  setUserName(fullName);
                }
                
                if (userData.photoURL) {
                  setUserPhoto(userData.photoURL);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format the name to capitalize first letter of each word
  const formatName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get first name only if full name is available
  const getFirstName = (name) => {
    if (!name) return '';
    return name.split(' ')[0];
  };

  // Generate initials from full name (e.g., "Shilpa Vadher" -> "SV")
  const generateInitials = (name) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return '';
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primary + 'E6']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.headerContent}>
        {/* Left section: User info */}
        <View style={styles.userInfo}>
          {console.log('Rendering - userPhoto:', userPhoto, 'userName:', userName)}
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {generateInitials(userName)}
              </Text>
            </View>
          )}
          
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {formatName(getFirstName(userName))}
            </Text>
          </View>
        </View>
        
        {/* Right section: Action buttons - Different based on user type */}
        <View style={styles.actions}>
          {userType === 'customer' ? (
            <>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={onWishlistPress}
              >
                <Icon name="heart-outline" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={onCartPress}
              >
                <Icon name="cart-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={onAddProductPress}
              >
                <Icon name="add-circle-outline" size={28} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={onAddPostPress}
              >
                <Icon name="create-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.wavyBackground}>
        <View style={styles.wave} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  wavyBackground: {
    overflow: 'hidden',
    width: '100%',
    height: 15,
    position: 'absolute',
    bottom: -1,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

export default WelcomeHeader;