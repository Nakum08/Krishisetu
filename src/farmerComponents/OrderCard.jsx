import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const OrderCard = ({ order, onStatusUpdate }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#FFA726'; // Orange
      case 'processing': return '#42A5F5'; // Blue
      case 'shipped': return '#7E57C2'; // Purple
      case 'out_for_delivery': return '#26A69A'; // Teal
      case 'delivered': return '#66BB6A'; // Green
      case 'cancelled': return '#EF5350'; // Red
      default: return '#757575'; // Grey
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return 'checkmark-circle-outline';
      case 'processing': return 'construct-outline';
      case 'shipped': return 'car-outline';
      case 'out_for_delivery': return 'bicycle-outline';
      case 'delivered': return 'checkmark-done-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'ellipsis-horizontal-circle-outline';
    }
  };
  
  const getNextStatuses = (currentStatus) => {
    switch(currentStatus) {
      case 'confirmed': return ['processing', 'cancelled'];
      case 'processing': return ['shipped', 'cancelled'];
      case 'shipped': return ['out_for_delivery', 'cancelled'];
      case 'out_for_delivery': return ['delivered', 'cancelled'];
      case 'delivered': return [];
      case 'cancelled': return [];
      default: return [];
    }
  };
  
  const nextStatuses = getNextStatuses(order.status);
  const orderDate = formatDate(order.createdAt);
  const estimatedDelivery = formatDate(order.estimatedDelivery);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{t('farmer.order')} #{order.id}</Text>
          <Text style={styles.date}>{orderDate}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Ionicons name={getStatusIcon(order.status)} size={14} color="#FFF" style={styles.statusIcon} />
            <Text style={styles.statusText}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
            </Text>
          </View>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#757575" 
          />
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.customerInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('farmer.customer')}:</Text>
              <Text style={styles.infoValue}>
                {order.shippingInfo?.fullName || t('farmer.unknownCustomer')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('farmer.contact')}:</Text>
              <Text style={styles.infoValue}>
                {order.shippingInfo?.phoneNumber || t('common.notAvailable')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('farmer.deliveryBy')}:</Text>
              <Text style={styles.infoValue}>{estimatedDelivery || t('farmer.notSpecified')}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>{t('farmer.products')}</Text>
            {order.product ? (
              <View style={styles.productRow}>
                <Image 
                  source={{ uri: order.product?.images?.[0] || 'https://via.placeholder.com/40' }} 
                  style={styles.productImage} 
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{order.product?.crop || t('farmer.product')}</Text>
                  <Text style={styles.productMeta}>
                    {t('farmer.qty')}: {order.quantity || 1} × ₹{order.product?.pricePerKg || 0}/kg
                  </Text>
                  {order.product?.farmerName && (
                    <Text style={styles.farmerName}>{t('farmer.farmer')}: {order.product.farmerName}</Text>
                  )}
                </View>
                <Text style={styles.productPrice}>₹{order.subtotal?.toFixed(2) || '0.00'}</Text>
              </View>
            ) : order.products && order.products.length > 0 ? (
              order.products.map((product, index) => (
                <View key={index} style={styles.productRow}>
                  <Image 
                    source={{ uri: product.image || 'https://via.placeholder.com/40' }} 
                    style={styles.productImage} 
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name || `${t('farmer.product')} ${index + 1}`}</Text>
                    <Text style={styles.productQuantity}>
                      {product.quantity || 1} × ₹{product.pricePerUnit || 0}/kg
                    </Text>
                  </View>
                  <Text style={styles.productTotal}>₹{product.subtotal?.toFixed(2) || '0.00'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noProductText}>{t('farmer.noProductDetails')}</Text>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('farmer.subtotal')}:</Text>
              <Text style={styles.totalValue}>₹{order.subtotal.toFixed(2)}</Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('farmer.discount')}:</Text>
                <Text style={styles.discountValue}>-₹{order.discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('farmer.deliveryFee')}:</Text>
              <Text style={styles.totalValue}>₹{order.deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalLabel}>{t('farmer.total')}:</Text>
              <Text style={styles.finalTotalValue}>₹{order.total.toFixed(2)}</Text>
            </View>
          </View>
          
          {nextStatuses.length > 0 && (
            <View style={styles.actionButtons}>
              {nextStatuses.map(status => (
                <TouchableOpacity 
                  key={status}
                  style={[
                    styles.actionButton,
                    { backgroundColor: status === 'cancelled' ? '#FFCDD2' : '#E8F5E9' }
                  ]}
                  onPress={() => onStatusUpdate(order.docId, status)}
                >
                  <Ionicons 
                    name={status === 'cancelled' ? 'close-circle' : 'checkmark-circle'} 
                    size={16} 
                    color={status === 'cancelled' ? '#D32F2F' : '#4CAF50'} 
                    style={styles.actionIcon} 
                  />
                  <Text 
                    style={[
                      styles.actionText,
                      { color: status === 'cancelled' ? '#D32F2F' : '#4CAF50' }
                    ]}
                  >
                    {status === 'processing' ? t('farmer.process') : 
                     status === 'shipped' ? t('farmer.ship') : 
                     status === 'out_for_delivery' ? t('farmer.outForDelivery') : 
                     status === 'delivered' ? t('farmer.markDelivered') : 
                     t('farmer.cancelOrder')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#757575',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  customerInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  productSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 13,
    color: '#757575',
  },
  productTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  totalSection: {
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#757575',
  },
  totalValue: {
    fontSize: 14,
    color: '#333333',
  },
  discountValue: {
    fontSize: 14,
    color: '#4CAF50',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  finalTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 5,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4CAF50',
  },
  farmerName: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  noProductText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    padding: 10,
  },
  productMeta: {
    fontSize: 12,
    color: '#757575',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});

export default OrderCard; 