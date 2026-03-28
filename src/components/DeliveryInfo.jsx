import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DeliveryInfo = ({ shippingInfo, deliveryOption, estimatedDelivery }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Information</Text>
      
      <View style={styles.addressContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color="#4CAF50" />
        </View>
        <View style={styles.addressDetails}>
          <Text style={styles.addressName}>{shippingInfo.fullName}</Text>
          <Text style={styles.addressText}>
            {shippingInfo.address}, {shippingInfo.landmark && `${shippingInfo.landmark}, `}
            {shippingInfo.city} - {shippingInfo.pincode}
          </Text>
          <Text style={styles.phoneNumber}>Phone: {shippingInfo.phoneNumber}</Text>
        </View>
      </View>
      
      <View style={styles.deliveryDetails}>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <Text style={styles.label}>Delivery Option</Text>
            <View style={styles.optionBadge}>
              <Text style={styles.optionText}>
                {deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
              </Text>
            </View>
          </View>
          <View style={styles.deliveryItem}>
            <Text style={styles.label}>Estimated Delivery</Text>
            <Text style={styles.deliveryDate}>{estimatedDelivery}</Text>
          </View>
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
  addressContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    marginRight: 10,
    paddingTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 13,
    color: '#555555',
  },
  deliveryDetails: {
    marginTop: 15,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  optionBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  optionText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  deliveryDate: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});

export default DeliveryInfo;