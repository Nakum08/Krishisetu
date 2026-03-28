import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const OrderDetails = ({ product, quantity, orderType }) => {
  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'sample':
        return 'Sample Order';
      case 'bulk':
        return 'Bulk Order';
      default:
        return 'Regular Order';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Details</Text>
      
      <View style={styles.productContainer}>
        <Image 
          source={{ uri: product.images[0] || 'https://via.placeholder.com/60' }} 
          style={styles.productImage} 
          // defaultSource={require('../assets/login.jpg')} // You'll need to add this placeholder image
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.crop}</Text>
          <Text style={styles.sellerName}>Sold by: {product.sellerName}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.productQuantity}>Qty: {quantity}</Text>
            <Text style={styles.orderType}>{getOrderTypeLabel(orderType)}</Text>
          </View>
        </View>
        <Text style={styles.productPrice}>₹{product.pricePerKg * quantity}</Text>
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
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
  sellerName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 12,
    color: '#555555',
    marginRight: 10,
  },
  orderType: {
    fontSize: 10,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});

export default OrderDetails;
