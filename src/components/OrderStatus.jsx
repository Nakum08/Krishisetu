import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderStatus = ({ orderId, status, date }) => {
  return (
    <View style={styles.container}>
      <View style={styles.orderIdContainer}>
        <Text style={styles.orderIdLabel}>Order ID:</Text>
        <Text style={styles.orderId}>{orderId}</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="copy-outline" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Order Date</Text>
          <Text style={styles.value}>{date}</Text>
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
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderIdLabel: {
    fontSize: 14,
    color: '#555555',
    marginRight: 5,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  copyButton: {
    marginLeft: 8,
    padding: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statusContainer: {
    flex: 1,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrderStatus;