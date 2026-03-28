import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme/theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const OrderCard = ({ order, onPress }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#FF9800';
      case 'Shipped':
        return '#2196F3';
      case 'Delivered':
        return '#4CAF50';
      case 'Cancelled':
        return '#F44336';
      default:
        return theme.colors.textSecondary;
    }
  };
  
  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);
  
  const displayImage = order.items[0]?.product?.images?.[0] || 
    'https://via.placeholder.com/100?text=No+Image';
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id.substring(0, 8)}</Text>
          <Text style={styles.date}>{formatDate(order.orderDate)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.itemsRow}>
        <Image source={{ uri: displayImage }} style={styles.productImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemCount}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.mainItem} numberOfLines={1}>
            {order.items[0]?.product?.crop || 'Product'} 
            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
          </Text>
        </View>
        
        <View style={styles.priceView}>
          <Text style={styles.totalPrice}>₹{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.bottomRow}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.deliveryText}>
            {order.deliveryAddress ? 
              `${order.deliveryAddress.city}, ${order.deliveryAddress.state}` : 
              'Delivery address unavailable'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.trackButton} onPress={onPress}>
          <Text style={styles.trackButtonText}>Track</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: s(16),
    borderWidth: 1, 
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(12),
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: ms(14),
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: s(4),
  },
  date: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: ms(12),
  },
  statusText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: '#FFF',
  },
  divider: {
    height: s(1),
    backgroundColor: '#F0F0F0',
    marginVertical: s(12),
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(12),
  },
  productImage: {
    width: s(50),
    height: s(50),
    borderRadius: ms(8),
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: s(12),
  },
  itemCount: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginBottom: s(4),
  },
  mainItem: {
    fontSize: ms(14),
    fontWeight: '500',
    color: theme.colors.text,
  },
  priceView: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginLeft: s(4),
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: s(12),
    paddingVertical: s(6),
    borderRadius: ms(16),
  },
  trackButtonText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: theme.colors.primary,
    marginRight: s(4),
  },
});

export default OrderCard; 