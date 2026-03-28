import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const SeasonalBanner = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.seasonText}>SEASONAL SPECIAL</Text>
            <Text style={styles.mainText}>Fresh Mangoes</Text>
            <Text style={styles.subText}>Directly from Ratnagiri farms</Text>
            
            <View style={styles.button}>
              <Text style={styles.buttonText}>Explore</Text>
              <Icon name="arrow-forward" size={16} color={COLORS.white} style={styles.buttonIcon} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    height: 160,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: SIZES.radius,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  seasonText: {
    color: COLORS.yellow,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  mainText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonIcon: {
    marginLeft: 6,
  },
});

export default SeasonalBanner;

// constants/index.js
export const COLORS = {
  primary: '#4CAF50',
  secondary: '#388E3C',
  white: '#FFFFFF',
  black: '#111111',
  gray: '#757575',
  lightGray: '#9E9E9E',
  darkGray: '#424242',
  lightBackground: '#F5F5F5',
  yellow: '#FFC107',
  red: '#E53935',
  green: '#43A047',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 16,
  radius: 12,
};