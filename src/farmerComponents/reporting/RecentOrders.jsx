import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms } from '../../utils/responsive.js';

const RecentOrders = ({ orders = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#FFA726';
      case 'processing': return '#42A5F5';
      case 'shipped': return '#7E57C2';
      case 'delivered': return '#66BB6A';
      default: return '#757575';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return 'checkmark-circle-outline';
      case 'processing': return 'construct-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-done-circle-outline';
      default: return 'ellipsis-horizontal-circle-outline';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Orders</Text>
        {orders.length > 0 && (
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
      
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No recent orders</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when customers make purchases</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Ionicons name={getStatusIcon(order.status)} size={12} color="#FFF" style={styles.statusIcon} />
                <Text style={styles.statusText}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productText}>
                  {order.quantity} kg {order.product}
                </Text>
                <Text style={styles.orderTotal}>₹{order.total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: s(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  title: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: ms(12),
    color: '#4CAF50',
    marginRight: s(2),
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: ms(8),
    padding: s(12),
    marginBottom: s(12),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(8),
  },
  orderId: {
    fontSize: ms(14),
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: ms(12),
  },
  statusIcon: {
    marginRight: s(4),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: ms(10),
    fontWeight: '600',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: s(8),
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(4),
  },
  customerName: {
    fontSize: ms(13),
    color: '#333',
  },
  orderDate: {
    fontSize: ms(12),
    color: '#757575',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productText: {
    fontSize: ms(12),
    color: '#757575',
  },
  orderTotal: {
    fontSize: ms(14),
    fontWeight: '600',
    color: '#4CAF50',
  },
  emptyState: {
    padding: s(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: ms(16),
    color: '#757575',
    marginTop: s(16),
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: ms(14),
    color: '#9E9E9E',
    marginTop: s(8),
    textAlign: 'center',
  },
});

export default RecentOrders; 