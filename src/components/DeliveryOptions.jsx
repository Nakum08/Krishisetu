import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const DeliveryOptions = ({ selectedOption, setSelectedOption }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('delivery.deliveryOptions')}</Text>
      
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedOption === 'standard' && styles.selectedOption
        ]}
        onPress={() => setSelectedOption('standard')}
      >
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name="bicycle-outline" 
            size={24} 
            color={selectedOption === 'standard' ? '#4CAF50' : '#999'} 
          />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{t('delivery.standardDelivery')}</Text>
          <Text style={styles.optionDescription}>{t('delivery.standardDeliveryTime')}</Text>
        </View>
        <View style={styles.optionPrice}>
          <Text style={styles.priceText}>₹20</Text>
        </View>
        {selectedOption === 'standard' && (
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedOption === 'express' && styles.selectedOption
        ]}
        onPress={() => setSelectedOption('express')}
      >
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name="flash-outline" 
            size={24} 
            color={selectedOption === 'express' ? '#FF9800' : '#999'} 
          />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{t('delivery.expressDelivery')}</Text>
          <Text style={styles.optionDescription}>{t('delivery.expressDeliveryTime')}</Text>
        </View>
        <View style={styles.optionPrice}>
          <Text style={styles.priceText}>₹50</Text>
        </View>
        {selectedOption === 'express' && (
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  optionPrice: {
    paddingHorizontal: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  checkIcon: {
    marginLeft: 8,
  },
});

export default DeliveryOptions;