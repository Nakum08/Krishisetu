import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const SeasonalBanner = ({ onPress }) => {
  const { t } = useTranslation();
  const currentSeason = t('productDetails.summer');
  const bannerImage = "https://images.unsplash.com/photo-1591616822954-2065a586a01e";
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: bannerImage }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.seasonText}>{currentSeason} {t('banners.seasonalSpecial')}</Text>
            <Text style={styles.title}>{t('banners.freshSeasonalProduce')}</Text>
            <Text style={styles.subtitle}>{t('banners.discoverWhatsInSeason')}</Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{t('banners.explore')}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(16),
    marginVertical: s(16),
    height: s(160),
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: ms(12),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    borderRadius: ms(12),
  },
  content: {
    paddingHorizontal: s(20),
  },
  seasonText: {
    fontSize: ms(12),
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: s(8),
  },
  title: {
    fontSize: ms(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: s(4),
  },
  subtitle: {
    fontSize: ms(14),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: s(12),
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: s(16),
    paddingVertical: s(8),
    borderRadius: ms(20),
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
  },
});

export default SeasonalBanner; 