import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

const ConfirmationHeader = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{t('confirmation.orderPlacedSuccessfully')}</Text>
      <Text style={styles.subtitle}>{t('confirmation.thankYouForShopping')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animationContainer: {
    height: 100,
    width: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
  },
});

export default ConfirmationHeader;