import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmationHeader from '../components/ConfirmationHeader';
import OrderStatus from '../components/OrderStatus';
import OrderDetails from '../components/OrderDetails';
import DeliveryInfo from '../components/DeliveryInfo';
import PaymentSummary from '../components/PaymentSummary';
import ActionButtons from '../components/ActionButtons';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { order } = route.params || {};
  const { t } = useTranslation();

  useEffect(() => {
    if (!order || !order.id) {
      console.error('Invalid order object or missing ID:', order);
      Alert.alert(t('common.error'), t('orderConfirmation.invalidOrderInfo'));
      navigation.goBack();
    }
  }, [order]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const orderDate = formatDate(order?.createdAt || new Date());
  
  const deliveryDate = formatDate(order?.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  
  const shareOrderDetails = async () => {
    try {
      await Share.share({
        message: `I just placed an order #${order.id} on KrishiSetu! Estimated delivery: ${deliveryDate}. Order total: ₹${order.total?.toFixed(2) || '0.00'}`,
        title: 'My FarmFresh Order'
      });
    } catch (error) {
      console.error('Error sharing order details:', error);
    }
  };
  
  
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'CustomerMain' }]
    });
  };
  

  const trackOrder = () => {
    navigation.navigate('OrderTrackingScreen', { 
      orderId: order.id,
      orderData: order 
    });
  };
  
  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
          <Text style={styles.errorText}>Order information is missing or invalid</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Confirmation Header */}
      <ConfirmationHeader navigation={navigation} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <OrderStatus 
          orderId={order.id}
          status={order.status}
          date={orderDate}
        />
        
        {/* Order Details */}
        <OrderDetails 
          product={order.product}
          quantity={order.quantity}
          orderType={order.orderType}
        />
        
        {/* Delivery Information */}
        <DeliveryInfo
          shippingInfo={order.shippingInfo}
          deliveryOption={order.deliveryOption}
          estimatedDelivery={deliveryDate}
        />
        
        {/* Payment Summary */}
        <PaymentSummary
          subtotal={order.subtotal}
          discount={order.discount}
          deliveryFee={order.deliveryFee}
          total={order.total}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentMethod === 'cod' ? 'pending' : 'paid'}
        />
      </ScrollView>
      
      {/* Action Buttons */}
      <ActionButtons
        onTrackOrder={trackOrder}
        onContinueShopping={goToHome}
        onShareOrder={shareOrderDetails}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  errorText: {
    fontSize: ms(16),
    color: '#333',
    textAlign: 'center',
    marginVertical: s(20),
  },
  errorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    borderRadius: ms(8),
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderConfirmationScreen;