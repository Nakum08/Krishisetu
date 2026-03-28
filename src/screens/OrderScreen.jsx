import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import ShippingForm from '../components/ShippingForm';
import PaymentOptions from '../components/PaymentOptions';
import DeliveryOptions from '../components/DeliveryOptions'; 
import PromoCode from '../components/PromoCode';
import PriceBreakdown from '../components/PriceBreakdown';
import CheckoutButton from '../components/CheckoutButton';
import { createOrder } from '../services/firestoreSeedOrders';
import UnifiedHeader from '../components/UnifiedHeader';

const OrderScreen = ({ route, navigation }) => {
  const { product, quantity, orderType, totalPrice } = route.params || {};
  const { t } = useTranslation();
  
  console.log("Viral143 Order Screen:", product.farmerId);
  
  const defaultProduct = {
    images: [],
    crop: 'Product Name',
    pricePerKg: 0,
    sellerName: 'Unknown Seller',
    id: '0',
    bulkMinimumQuantity: 10,
    bulkDiscountPercentage: 8,
    samplePrice: 50,
  };
  
  const processedProduct = product || defaultProduct;
  const orderQuantity = quantity || 1;
  const selectedOrderType = orderType || 'regular';
  const orderTotalPrice = parseFloat(totalPrice) || parseFloat(processedProduct.pricePerKg * orderQuantity);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const deliveryFee = selectedDeliveryOption === 'express' ? 50 : 20;
  const subtotal = parseFloat(orderTotalPrice) || 0;
  const totalWithDiscount = subtotal - discount;
  const finalTotal = totalWithDiscount + deliveryFee;

  // Calculate prices
  // const deliveryFee = selectedDeliveryOption === 'express' ? 50 : 20;
  // const subtotal = orderTotalPrice;
  // const totalWithDiscount = subtotal - discount;
  // const finalTotal = totalWithDiscount + deliveryFee;
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'fresh20') {
      const discountAmount = subtotal * 0.2; 
      setDiscount(discountAmount);
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied successfully!');
    } else if (promoCode.toLowerCase() === 'farm10') {
      const discountAmount = subtotal * 0.1; 
      setDiscount(discountAmount);
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied successfully!');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };
  const placeOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.pincode) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get current user ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('OrderScreen - User token from AsyncStorage:', userToken);
      
      if (!userToken) {
        Alert.alert('Error', 'User not logged in. Please sign in again.');
        return;
      }
      
      const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
      
      const orderData = {
        id: orderId,
        userId: userToken, // Use actual user ID instead of random
        farmerId: processedProduct.farmerId || 'unknown-farmer', 
        product: processedProduct,
        products: [
          {
            productId: processedProduct.id,
            quantity: orderQuantity,
            pricePerUnit: processedProduct.pricePerKg,
            orderType: selectedOrderType,
            subtotal: parseFloat(subtotal),
          }
        ],
        quantity: orderQuantity,
        orderType: selectedOrderType,
        subtotal: parseFloat(subtotal),
        discount: parseFloat(discount),
        deliveryFee: parseFloat(deliveryFee),
        total: parseFloat(finalTotal),
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === 'cod' ? 'pending' : 'pending', 
        deliveryOption: selectedDeliveryOption,
        shippingInfo: shippingInfo,
        status: 'confirmed',
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Order confirmed',
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: getEstimatedDeliveryDate(selectedDeliveryOption),
        actualDelivery: null,
        cancelReason: '',
        notes: '',
      };
      
      await createOrder(orderData);
      
      if (selectedPaymentMethod === 'cod') {
        navigation.navigate('OrderConfirmationScreen', { order: orderData });
      } else {
        navigation.navigate('PaymentProcessingScreen', { order: orderData });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const getEstimatedDeliveryDate = (deliveryType) => {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    if (deliveryType === 'express') {
      deliveryDate.setDate(today.getDate() + 1); 
    } else {
      deliveryDate.setDate(today.getDate() + 3); 
    }
    
    return deliveryDate.toISOString();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <UnifiedHeader
        title={t('order.order')}
        subtitle={t('order.completeYourOrder')}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <OrderSummary 
          product={processedProduct}
          quantity={orderQuantity}
          orderType={selectedOrderType}
        />
        
        {/* Shipping Information */}
        <ShippingForm
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
        />
        
        {/* Delivery Options */}
        <DeliveryOptions
          selectedOption={selectedDeliveryOption}
          setSelectedOption={setSelectedDeliveryOption}
        />
        
        {/* Payment Options */}
        <PaymentOptions
          selectedMethod={selectedPaymentMethod}
          setSelectedMethod={setSelectedPaymentMethod}
        />
        
        {/* Promo Code */}
        <PromoCode
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          promoApplied={promoApplied}
          applyPromoCode={applyPromoCode}
        />
        
        {/* Price Breakdown */}
        <PriceBreakdown
          subtotal={subtotal}
          discount={discount}
          deliveryFee={deliveryFee}
          total={finalTotal}
        />
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Checkout Button */}
      <CheckoutButton
        total={finalTotal}
        isProcessing={isProcessing}
        onPress={placeOrder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default OrderScreen;

