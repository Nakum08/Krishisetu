import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getOrderById, updateOrderStatus } from '../services/firestoreSeedOrders';
import Header from '../components/Header';
import { useTranslationUtils } from '../services/translationService';
import theme from '../theme/theme';
import UnifiedHeader from '../components/UnifiedHeader';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId, orderData } = route.params || {};
  const { getTranslatedProductName } = useTranslationUtils();
  const [order, setOrder] = useState(orderData || null);
  const [loading, setLoading] = useState(!orderData);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
    if (!orderData && orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const fetchedOrder = await getOrderById(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setError(`Failed to fetch order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === order.status) {
      return;
    }

    Alert.alert(
      "Update Order Status",
      `Are you sure you want to change the status from "${order.status}" to "${newStatus}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Update",
          onPress: async () => {
            try {
              setUpdating(true);
              await updateOrderStatus(order.id, newStatus);
              
              setOrder({
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString()
              });
              
              Alert.alert("Success", `Order status updated to ${newStatus}`);
            } catch (error) {
              console.error("Failed to update status:", error);
              Alert.alert("Error", `Failed to update status: ${error.message}`);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    ); 
  };

  const getNextPossibleStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'confirmed':
        return ['Processing'];
      case 'Processing':
        return ['Shipped'];
      case 'Shipped':
        return ['Delivered'];
      case 'Delivered':
        return []; 
      default:
        return ['confirmed', 'Processing', 'Shipped', 'Delivered'];
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusStep = (status) => {
    const statuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const index = statuses.indexOf(status);
    return index !== -1 ? index : 0;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="search" size={60} color="#757575" />
        <Text style={styles.errorTitle}>Order Not Found</Text>
        <Text style={styles.errorText}>We couldn't find the order you're looking for.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentStep = getStatusStep(order.status);
  const estimatedDeliveryDate = formatDate(order.estimatedDelivery);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <UnifiedHeader
        title="Track"
        subtitle="Track Your Order"
        />
      <ScrollView showsVerticalScrollIndicator={false}> 
        {/* Order Basic Info */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderId}>{order.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Est. Delivery</Text>
              <Text style={styles.infoValue}>{estimatedDeliveryDate}</Text>
            </View>
          </View>
        </View>
        
        {/* Order Tracking Status */}
        <View style={styles.trackingCard}>
          <Text style={styles.cardTitle}>Delivery Status</Text>
          
          {/* Status Stepper */}
          <View style={styles.stepper}>
            {/* Confirmed */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 0 && styles.activeStep]}>
                <Ionicons 
                  name={currentStep >= 0 ? "checkmark" : "ellipse"} 
                  size={currentStep >= 0 ? 16 : 8} 
                  color={currentStep >= 0 ? "#FFFFFF" : "#CCCCCC"} 
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, currentStep >= 0 && styles.activeStepText]}>Order Confirmed</Text>
                <Text style={styles.stepDesc}>Your order has been received</Text>
              </View>
            </View>
            
            {/* Connecting Line */}
            <View style={[styles.connectorLine, currentStep >= 1 && styles.activeConnector]} />
            
            {/* Processing */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStep]}>
                <Ionicons 
                  name={currentStep >= 1 ? "checkmark" : "ellipse"} 
                  size={currentStep >= 1 ? 16 : 8} 
                  color={currentStep >= 1 ? "#FFFFFF" : "#CCCCCC"} 
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, currentStep >= 1 && styles.activeStepText]}>Processing</Text>
                <Text style={styles.stepDesc}>Your order is being prepared</Text>
              </View>
            </View>
            
            {/* Connecting Line */} 
            <View style={[styles.connectorLine, currentStep >= 2 && styles.activeConnector]} />
            
            {/* Shipped */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]}>
                <Ionicons 
                  name={currentStep >= 2 ? "checkmark" : "ellipse"} 
                  size={currentStep >= 2 ? 16 : 8} 
                  color={currentStep >= 2 ? "#FFFFFF" : "#CCCCCC"} 
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, currentStep >= 2 && styles.activeStepText]}>Shipped</Text>
                <Text style={styles.stepDesc}>Your order is on its way</Text>
              </View>
            </View>
            
            {/* Connecting Line */}
            <View style={[styles.connectorLine, currentStep >= 3 && styles.activeConnector]} />
            
            {/* Out For Delivery */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 3 && styles.activeStep]}>
                <Ionicons 
                  name={currentStep >= 3 ? "checkmark" : "ellipse"} 
                  size={currentStep >= 3 ? 16 : 8} 
                  color={currentStep >= 3 ? "#FFFFFF" : "#CCCCCC"} 
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, currentStep >= 3 && styles.activeStepText]}>Out for Delivery</Text>
                <Text style={styles.stepDesc}>The order is out for delivery</Text>
              </View>
            </View>
            
            {/* Connecting Line */}
            <View style={[styles.connectorLine, currentStep >= 4 && styles.activeConnector]} />
            
            {/* Delivered */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep >= 4 && styles.activeStep]}>
                <Ionicons 
                  name={currentStep >= 4 ? "checkmark" : "ellipse"} 
                  size={currentStep >= 4 ? 16 : 8} 
                  color={currentStep >= 4 ? "#FFFFFF" : "#CCCCCC"} 
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, currentStep >= 4 && styles.activeStepText]}>Delivered</Text>
                <Text style={styles.stepDesc}>Order has been delivered</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Order Details Summary */}
        <View style={styles.orderDetailsCard}>
          <Text style={styles.cardTitle}>Order Details</Text>
          
          <View style={styles.productItem}>
            <Image
              source={{ uri: order.product.images[0] || 'https://via.placeholder.com/50' }}
              style={styles.productImage}
              // defaultSource={require('../assets/placeholder.png')}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{getTranslatedProductName(order.product.crop)}</Text>
              <Text style={styles.productType}>{order.orderType === 'bulk' ? 'Bulk Order' : order.orderType === 'sample' ? 'Sample Order' : 'Regular Order'}</Text>
              <Text style={styles.productMeta}>Qty: {order.quantity} | ₹{order.product.pricePerKg}/kg</Text>
            </View>
            <Text style={styles.productPrice}>₹{order.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceDetails}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{order.subtotal.toFixed(2)}</Text>
            </View>
            
            {order.discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={[styles.priceValue, styles.discountText]}>- ₹{order.discount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>₹{order.deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        {/* Shipping Address */}
        <View style={styles.addressCard}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          
          <Text style={styles.addressName}>{order.shippingInfo.fullName}</Text>
          <Text style={styles.addressText}>
            {order.shippingInfo.address}, 
            {order.shippingInfo.landmark && ` ${order.shippingInfo.landmark},`} 
            {order.shippingInfo.city} - {order.shippingInfo.pincode}
          </Text>
          <Text style={styles.addressPhone}>Phone: {order.shippingInfo.phoneNumber}</Text>
        </View>
        
        {/* Support Button */}
        <TouchableOpacity style={styles.supportButton}>
          <Ionicons name="headset-outline" size={20} color="#4CAF50" style={styles.supportIcon} />
          <Text style={styles.supportText}>Need help with your order?</Text>
          <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orderInfoCard: {
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
    marginBottom: 12,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  stepper: {
    paddingHorizontal: 5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeStep: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
    paddingVertical: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 2,
  },
  activeStepText: {
    color: '#333333',
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  connectorLine: {
    width: 2,
    height: 25,
    backgroundColor: '#EEEEEE',
    marginLeft: 11,
    marginBottom: 5,
  },
  activeConnector: {
    backgroundColor: '#4CAF50',
  },
  orderDetailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productItem: {
    flexDirection: 'row',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  productType: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 3,
  },
  productMeta: {
    fontSize: 12,
    color: '#757575',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  priceDetails: {
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
  discountText: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#555555',
  },
  supportButton: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  supportIcon: {
    marginRight: 10,
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  updateStatusContainer: {
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  updateStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  statusButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 8,
  },
  noMoreUpdatesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default OrderTrackingScreen;