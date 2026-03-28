import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const OrderSummary = ({ product, quantity, orderType }) => {
  const { t } = useTranslation();
  
  console.log("OrderSummary - Product:", JSON.stringify(product));
  console.log("OrderSummary - Images array:", JSON.stringify(product.images));
  console.log("OrderSummary - First image:", product.images && product.images.length > 0 ? JSON.stringify(product.images[0]) : "No image");
  
  const getOrderTypeLabel = () => {
    switch(orderType) {
      case 'sample': return t('order.sampleOrder', { quantity: '1' });
      case 'bulk': return t('order.bulkOrder', { quantity });
      default: return t('order.regularOrder', { quantity });
    }
  };
  
  const imageUrl = product && product.images && product.images.length > 0 
    ? String(product.images[0]) 
    : 'https://via.placeholder.com/80';
  
  console.log("OrderSummary - Final image URL used:", imageUrl);
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('order.orderSummary')}</Text>
      <View style={styles.productContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.crop}</Text>
          <Text style={styles.productPrice}>₹{product.pricePerKg}/kg</Text>
          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{getOrderTypeLabel()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{product.sellerName}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: s(20),
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: s(16),
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: s(80),
    height: s(80),
    borderRadius: ms(8),
    backgroundColor: '#f5f5f5',
  },
  productDetails: {
    flex: 1,
    marginLeft: s(14),
  },
  productName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: s(4),
  },
  productPrice: {
    fontSize: ms(15),
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: s(8),
  },
  productMeta: {
    flexDirection: 'column',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(4),
  },
  metaText: {
    fontSize: ms(13),
    color: '#666',
    marginLeft: s(4),
  },
});

export default OrderSummary;