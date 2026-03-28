import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const ActionButtons = ({ onTrackOrder, onContinueShopping, onShareOrder }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainButton} onPress={onTrackOrder}>
        <Ionicons name="location" size={18} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.mainButtonText}>{t('actionButtons.trackOrder')}</Text>
      </TouchableOpacity>
      
      <View style={styles.secondaryButtonsRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onContinueShopping}>
          <Ionicons name="cart-outline" size={16} color="#4CAF50" style={styles.secondaryButtonIcon} />
          <Text style={styles.secondaryButtonText}>{t('actionButtons.continueShopping')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={onShareOrder}>
          <Ionicons name="share-social-outline" size={16} color="#4CAF50" style={styles.secondaryButtonIcon} />
          <Text style={styles.secondaryButtonText}>{t('actionButtons.shareOrder')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mainButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
  },
  secondaryButtonIcon: {
    marginRight: 5,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ActionButtons;