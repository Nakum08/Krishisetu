import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslationUtils } from '../services/translationService';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ProductInfoSection = ({ product, quantity, setQuantity, getCurrentPrice, orderType, toggleOrderType }) => {
  const { t } = useTranslation();
  const { getTranslatedProductName } = useTranslationUtils();
  
  return (
    <View style={styles.productInfoContainer}>
      <Text style={styles.productTitle}>{getTranslatedProductName(product.crop)}</Text>
      <Text style={styles.price}>₹{product.pricePerKg}/kg</Text>
      
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={`star-${i}`}
              name={i < Math.floor(product.rating) ? "star" : "star-outline"}
              size={18}
              color="#ff9500"
              style={{ marginRight: s(2) }}
            />
          ))}
        </View>
        <Text style={styles.ratingText}>{product.rating}/5</Text>
        <Text style={styles.reviewCount}>(120 reviews)</Text>
      </View>
      
      <View style={styles.sellerContainer}>
        <Text style={styles.sellerLabel}>{t('productDetails.farmer')}:</Text>
        <Text style={styles.sellerName}>{product.sellerName}</Text>
      </View>
      
      <View style={styles.farmingInfoContainer}>
        <View style={styles.farmingInfoItem}>
          <Ionicons name="leaf-outline" size={18} color="#4CAF50" />
          <Text style={styles.farmingInfoText}>{product.farmingMethod || t('productDetails.organic')}</Text>
        </View>
        <View style={styles.farmingInfoItem}>
          <Ionicons name="calendar-outline" size={18} color="#FF9800" />
          <Text style={styles.farmingInfoText}>{t('productDetails.harvested')}: {product.harvestedDate || t('productDetails.recent')}</Text>
        </View>
      </View>
      
      <View style={styles.estimatedTotalContainer}>
        <Text style={styles.estimatedTotalLabel}>{t('productDetails.total')}:</Text>
        <Text style={styles.estimatedTotalValue}>₹{getCurrentPrice()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productInfoContainer: {
    padding: s(20),
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  productTitle: {
    fontSize: ms(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: s(8),
  },
  price: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: s(10),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(12),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: s(8),
  },
  ratingText: {
    fontSize: ms(14),
    color: '#666',
    marginRight: s(5),
    fontWeight: 'bold',
  },
  reviewCount: {
    fontSize: ms(14),
    color: '#888',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(12),
  },
  sellerLabel: {
    fontSize: ms(14),
    color: '#666',
    marginRight: s(5),
  },
  sellerName: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#333',
  },
  farmingInfoContainer: {
    flexDirection: 'row',
    marginBottom: s(16),
  },
  farmingInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(16),
  },
  farmingInfoText: {
    fontSize: ms(14),
    color: '#666',
    marginLeft: s(4),
  },
  estimatedTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: s(8),
    paddingTop: s(12),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  estimatedTotalLabel: {
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
  },
  estimatedTotalValue: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProductInfoSection;
