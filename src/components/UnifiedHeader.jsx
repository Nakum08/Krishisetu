import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';

const UnifiedHeader = ({
  title,
  subtitle,
  showBackButton = false,
  showCartButton = false,
  showSearchButton = false,
  showNotificationButton = false,
  showMenuButton = false,
  notificationCount = 0,
  cartCount = 0,
  onBackPress,
  onCartPress,
  onSearchPress,
  onNotificationPress,
  onMenuPress,
  gradientColors = [theme.colors.primary, theme.colors.primary + 'E6'],
  textColor = "#FFFFFF"
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.headerContent}>
        {/* Left section: Back button (if enabled) or empty space */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onBackPress}
            >
              <Icon name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          )}
          
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {color: textColor}]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, {color: textColor + 'CC'}]}>{subtitle}</Text>
            )}
          </View>
        </View>
        
        {/* Right section: Action buttons */}
        <View style={styles.actions}>
          {showSearchButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onSearchPress}
            >
              <Icon name="search-outline" size={24} color={textColor} />
            </TouchableOpacity>
          )}
          
          {showNotificationButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onNotificationPress}
            >
              <Icon name="notifications-outline" size={24} color={textColor} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {showCartButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onCartPress}
            >
              <Icon name="cart-outline" size={24} color={textColor} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {showMenuButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onMenuPress}
            >
              <Icon name="menu-outline" size={26} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Wavy bottom edge */}
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B5C',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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

export default UnifiedHeader;