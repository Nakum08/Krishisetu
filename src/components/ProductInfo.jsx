import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { useTranslationUtils } from '../services/translationService';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ProductInfo = ({
  product,
  orderType,
  quantity,
  setQuantity,
  toggleOrderType,
  getCurrentPrice,
  getSamplePrice,
  showSampleOption = false,
}) => {
  const { t } = useTranslation();
  const { getTranslatedProductName, getTranslatedFarmerName } = useTranslationUtils();
  const productData = {
    crop: product?.crop || 'Apple',
    pricePerKg: product?.pricePerKg || 140,
    rating: product?.rating || 4.5,
    sellerName: product?.sellerName || 'Dghhh',
    farmingMethod: product?.farmingMethod || 'Organic',
    harvestedDate: product?.harvestedDate || '2024/1/1',
    bulkMinimumQuantity: product?.bulkMinimumQuantity || 10,
    bulkDiscountPercentage: product?.bulkDiscountPercentage || 8,
  };

  return (
    <View style={styles.productInfoContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.productTitle}>{getTranslatedProductName(productData.crop)}</Text>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{productData.rating}</Text>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>{t('productDetails.price')}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{productData.pricePerKg}/kg</Text>
          <View style={styles.organicBadge}>
            <Ionicons name="leaf" size={16} color="#fff" />
            <Text style={styles.organicText}>{t('productDetails.organic')}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Farmer Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={22} color="#51A65F" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>{t('productDetails.cultivatedBy')}</Text>
            <Text style={styles.infoValue}>{getTranslatedFarmerName(productData.sellerName)}</Text>
          </View>
        </View>
        
        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />
        
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={22} color="#51A65F" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>{t('productDetails.harvestedOn')}</Text>
            <Text style={styles.infoValue}>{productData.harvestedDate}</Text>
          </View>
        </View>
      </View>
      
      {/* Divider before Order Type */}
      <View style={styles.divider} />

      {/* Order Type Container */}
      <View style={styles.orderTypeContainer}>
        <Text style={styles.orderTypeLabel}>{t('productDetails.orderType')}:</Text>
        <View style={styles.orderTypeButtons}>
          <TouchableOpacity 
            style={[
              styles.newOrderTypeButton, 
              orderType === 'regular' && styles.newActiveOrderTypeButton,
            ]}
            onPress={() => toggleOrderType('regular')}
          >
            <Ionicons name="cart-outline" size={18} color={orderType === 'regular' ? "#fff" : "#666"} />
            <Text style={[
              styles.newOrderTypeText,
              orderType === 'regular' && styles.newActiveOrderTypeText,
            ]}>{t('productDetails.regular')}</Text>
          </TouchableOpacity>
          
          {showSampleOption && (
            <TouchableOpacity 
              style={[
                styles.newOrderTypeButton, 
                orderType === 'sample' && styles.newActiveOrderTypeButton,
              ]}
              onPress={() => toggleOrderType('sample')}
            >
              <Ionicons name="flask-outline" size={18} color={orderType === 'sample' ? "#fff" : "#666"} />
              <Text style={[
                styles.newOrderTypeText,
                orderType === 'sample' && styles.newActiveOrderTypeText,
              ]}>Try Sample</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.newOrderTypeButton, 
              orderType === 'bulk' && styles.newActiveOrderTypeButton,
              !showSampleOption ? { flex: 1 } : {}
            ]}
            onPress={() => toggleOrderType('bulk')}
          >
            <Ionicons name="cube-outline" size={18} color={orderType === 'bulk' ? "#fff" : "#666"} />
            <Text style={[
              styles.newOrderTypeText,
              orderType === 'bulk' && styles.newActiveOrderTypeText,
            ]}>{t('productDetails.bulkOrder')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.newOrderTypeInfoContainer}>
        {orderType === 'regular' && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>{t('productDetails.quantity')}:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.newQuantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={18} color="#51A65F" />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity} kg</Text>
              <TouchableOpacity 
                style={styles.newQuantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={18} color="#51A65F" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {orderType === 'sample' && (
          <View style={styles.sampleInfoContainer}>
            <View style={styles.sampleInfoItem}>
              <Ionicons name="information-circle-outline" size={18} color="#51A65F" />
              <Text style={styles.sampleInfoText}>
                Try a 1kg sample before committing to a bulk order
              </Text>
            </View>
            <View style={styles.samplePriceContainer}>
              <Text style={styles.samplePriceLabel}>Sample Price:</Text>
              <Text style={styles.samplePriceValue}>₹{getSamplePrice()}</Text>
            </View>
          </View>
        )}
        
        {orderType === 'bulk' && (
          <View style={styles.bulkInfoContainer}>
            <View style={styles.bulkInfoRow}>
              <View style={styles.bulkInfoItem}>
                <Ionicons name="cube-outline" size={18} color="#51A65F" />
                <Text style={styles.bulkInfoText}>
                  Min. {productData.bulkMinimumQuantity}kg
                </Text>
              </View>
              <View style={styles.bulkInfoItem}>
                <Ionicons name="pricetag-outline" size={18} color="#51A65F" />
                <Text style={styles.bulkInfoText}>
                  {productData.bulkDiscountPercentage}% off
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.newBulkDetailsButton}
              onPress={() => {}}
            >
              <Text style={styles.newBulkDetailsButtonText}>Bulk Order Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#51A65F" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.newEstimatedTotalContainer}>
        <Text style={styles.estimatedTotalLabel}>{t('productDetails.estimatedTotal')}:</Text>
        <Text style={styles.newEstimatedTotalValue}>₹{getCurrentPrice()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productInfoContainer: {
    padding: s(20),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(20),
  },
  productTitle: {
    fontSize: ms(25),
    fontWeight: 'bold',
    color: '#333',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: s(12),
    paddingVertical: s(6),
    borderRadius: ms(20),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: s(0), height: s(1) },
    elevation: 2,
  },
  ratingText: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333',
    marginLeft: s(4),
  },
  priceSection: {
    marginBottom: s(20),
  },
  priceLabel: {
    fontSize: ms(16),
    color: '#666',
    marginBottom: s(4),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color:  theme.colors.primary || '#2E7D32',
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#51A65F',
    paddingHorizontal: s(12),
    paddingVertical: s(8),
    borderRadius: ms(18),
  },
  organicText: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#fff',
    marginLeft: s(4),
  },
  divider: {
    height: s(1),
    backgroundColor: '#ddd',
    marginBottom: s(20),
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(20),
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
  },
  verticalDivider: {
    height: '100%',
    width: s(1),
    backgroundColor: '#ddd',
  },
  infoIcon: {
    marginRight: s(8),
  },
  infoLabel: {
    fontSize: ms(14),
    color: '#666',
  },
  infoValue: {
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
  },
  orderTypeContainer: {
    marginBottom: s(16),
    marginTop: s(5),
  },
  orderTypeLabel: {
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
    marginBottom: s(10),
  },
  orderTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newOrderTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(10),
    paddingHorizontal: s(12),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: s(4),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: s(0), height: s(1) },
    elevation: 1,
  },
  newActiveOrderTypeButton: {
    backgroundColor: '#51A65F',
    borderColor: '#51A65F',
  },
  newOrderTypeText: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#666',
    marginLeft: s(6),
  },
  newActiveOrderTypeText: {
    color: '#fff',
  },
  newOrderTypeInfoContainer: {
    marginBottom: s(16),
    padding: s(12),
    backgroundColor: '#fff',
    borderRadius: ms(8),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: s(0), height: s(1) },
    elevation: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: ms(15),
    fontWeight: '500',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newQuantityButton: {
    width: s(36),
    height: s(36),
    borderRadius: ms(18),
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: s(0), height: s(1) },
    elevation: 1,
  },
  quantityValue: {
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
    marginHorizontal: s(16),
  },
  sampleInfoContainer: {
    paddingVertical: s(4),
  },
  sampleInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(8),
  },
  sampleInfoText: {
    fontSize: ms(14),
    color: '#666',
    marginLeft: s(8),
    flex: 1,
  },
  samplePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: s(8),
  },
  samplePriceLabel: {
    fontSize: ms(15),
    fontWeight: '500',
    color: '#333',
  },
  samplePriceValue: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#51A65F',
  },
  bulkInfoContainer: {
    paddingVertical: s(4),
  },
  bulkInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(8),
  },
  bulkInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bulkInfoText: {
    fontSize: ms(14),
    color: '#666',
    marginLeft: s(8),
  },
  newBulkDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(8),
    paddingHorizontal: s(16),
    backgroundColor: '#ecf6ed',
    borderRadius: ms(20),
    alignSelf: 'center',
    marginTop: s(6),
  },
  newBulkDetailsButtonText: {
    fontSize: ms(14),
    color: '#51A65F',
    fontWeight: '500',
    marginRight: s(4),
  },
  newEstimatedTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: s(12),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  estimatedTotalLabel: {
    fontSize: ms(16),
    fontWeight: '500',
    color: '#333',
  },
  newEstimatedTotalValue: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#51A65F',
  },
});

export default ProductInfo;