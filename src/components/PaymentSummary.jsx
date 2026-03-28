import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PaymentSummary = ({ subtotal, discount, deliveryFee, total, paymentMethod, paymentStatus }) => {
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'upi':
        return 'UPI Payment';
      case 'card':
        return 'Card Payment';
      default:
        return 'Online Payment';
    }
  };
  
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cod':
        return 'cash-outline';
      case 'upi':
        return 'phone-portrait-outline';
      case 'card':
        return 'card-outline';
      default:
        return 'wallet-outline';
    }
  };
  
  const getPaymentStatusMessage = () => {
    if (paymentMethod === 'cod') {
      return 'Pay on delivery';
    }
    
    switch (paymentStatus) {
      case 'paid':
        return 'Payment completed';
      case 'pending':
        return 'Payment pending';
      case 'failed':
        return 'Payment failed';
      default:
        return 'Payment initiated';
    }
  };
  
  const getPaymentStatusColor = () => {
    if (paymentMethod === 'cod') {
      return '#4CAF50';
    }
    
    switch (paymentStatus) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FFA000';
      case 'failed':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      
      <View style={styles.paymentMethodContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={getPaymentMethodIcon(paymentMethod)} size={20} color="#4CAF50" />
        </View>
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>{getPaymentMethodLabel(paymentMethod)}</Text>
          <Text style={[styles.paymentStatus, { color: getPaymentStatusColor() }]}>
            {getPaymentStatusMessage()}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal</Text>
          <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
        </View>
        
        {discount > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={[styles.priceValue, styles.discountValue]}>- ₹{discount.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery Fee</Text>
          <Text style={styles.priceValue}>₹{deliveryFee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    marginRight: 10,
    paddingTop: 2,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  paymentStatus: {
    fontSize: 13,
    color: '#4CAF50',
  },
  priceBreakdown: {
    marginTop: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#555555',
  },
  priceValue: {
    fontSize: 14,
    color: '#333333',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
});

export default PaymentSummary;