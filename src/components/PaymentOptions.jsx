import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const PaymentOptions = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedMethod === 'cod' && styles.selectedOption
        ]}
        onPress={() => setSelectedMethod('cod')}
      >
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name="cash-outline" 
            size={24} 
            color={selectedMethod === 'cod' ? '#4CAF50' : '#999'} 
          />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Cash on Delivery</Text>
          <Text style={styles.optionDescription}>Pay when you receive your order</Text>
        </View>
        {selectedMethod === 'cod' && (
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedMethod === 'upi' && styles.selectedOption
        ]}
        onPress={() => setSelectedMethod('upi')}
      >
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name="wallet-outline" 
            size={24} 
            color={selectedMethod === 'upi' ? '#4CAF50' : '#999'} 
          />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>UPI Payment</Text>
          <Text style={styles.optionDescription}>Pay via UPI apps (GPay/PhonePe/Paytm)</Text>
        </View>
        {selectedMethod === 'upi' && (
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedMethod === 'card' && styles.selectedOption
        ]}
        onPress={() => setSelectedMethod('card')}
      >
        <View style={styles.optionIconContainer}>
          <Ionicons 
            name="card-outline" 
            size={24} 
            color={selectedMethod === 'card' ? '#4CAF50' : '#999'} 
          />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Credit/Debit Card</Text>
          <Text style={styles.optionDescription}>Pay with your bank card</Text>
        </View>
        {selectedMethod === 'card' && (
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: s(20),
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: s(16),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(14),
    paddingHorizontal: s(16),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: ms(8),
    marginBottom: s(12),
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  optionIconContainer: {
    width: s(40),
    height: s(40),
    borderRadius: ms(20),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: ms(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: s(4),
  },
  optionDescription: {
    fontSize: ms(13),
    color: '#666',
  },
  checkIcon: {
    marginLeft: s(8),
  },
});

export default PaymentOptions;