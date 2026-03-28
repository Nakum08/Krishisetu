import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const PriceBreakdown = ({ subtotal, discount, deliveryFee, total }) => (
  <View style={styles.priceBreakdownContainer}>
    <Text style={styles.sectionTitle}>Price Details</Text>
    
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Subtotal</Text>
      <Text style={styles.priceValue}>₹{parseFloat(subtotal).toFixed(2)}</Text>
    </View>
    
    {discount > 0 && (
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Discount</Text>
        <Text style={[styles.priceValue, styles.discountText]}>-₹{parseFloat(discount).toFixed(2)}</Text>
      </View>
    )}
    
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Delivery Fee</Text>
      <Text style={styles.priceValue}>₹{parseFloat(deliveryFee).toFixed(2)}</Text>
    </View>
    
    <View style={[styles.priceRow, styles.totalRow]}>
      <Text style={styles.totalLabel}>Total</Text>
      <Text style={styles.totalValue}>₹{parseFloat(total).toFixed(2)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PriceBreakdown;