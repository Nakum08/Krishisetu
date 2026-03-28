import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomBar = ({ getCurrentPrice, orderType, navigation, product, quantity }) => {
  const { t } = useTranslation();
  const totalPrice = parseFloat(getCurrentPrice());
  
  console.log("VR143 Bottom Bar:", product.farmerId); 
  

  const addToCart = async () => {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      
      const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          product: product,
          quantity: quantity,
          orderType: orderType
        });
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      Alert.alert(t('productDetails.success'), t('productDetails.productAddedToCart'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(t('productDetails.error'), t('productDetails.failedToAddToCart'));
    }
  };
  return (
    <View style={styles.bottomBar}>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>{t('productDetails.total')}:</Text> 
        <Text style={styles.totalPriceValue}>₹{totalPrice.toFixed(2)}</Text>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={addToCart}
        >
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>
            {orderType === 'sample' ? t('productDetails.getSample') : orderType === 'bulk' ? t('productDetails.bulkOrder') : t('productDetails.addToCart')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={() => {
            navigation.navigate('OrderScreen', {
              product: {
                ...product,
                farmerId: product.farmerId, 
              },
              quantity: quantity,
              orderType: orderType,
              totalPrice: totalPrice
            });
          }}
        >
          <Ionicons name="flash-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>{t('productDetails.buyNow')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalPriceContainer: {
    flexDirection: 'column',
  },
  totalPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B5C',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default BottomBar;