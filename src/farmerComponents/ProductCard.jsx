import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../theme';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ProductCard = ({ item, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.productCard}>
    {item.images?.length > 0 && (
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.productImage}
        resizeMode="cover"
      />
    )}
    <View style={styles.productInfo}>
      <Text style={styles.productTitle}>{item.crop}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>₹{item.pricePerKg}/kg</Text>
        <Text style={styles.productQuantity}>{t('farmer.qty')}: {item.quantity}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Icon name="pencil" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Icon name="delete" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: theme.colors.background,
    marginHorizontal: s(16),
    marginTop: s(16),
    borderRadius: ms(12),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(1) },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  productImage: {
    width: s(120),
    height: s(120),
  },
  productInfo: {
    flex: 1,
    padding: s(12),
  },
  productTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  productCategory: {
    fontSize: ms(14),
    color: '#7F8C8D',
    marginBottom: s(8),
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(12),
  },
  productPrice: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#27AE60',
  },
  productQuantity: {
    fontSize: ms(14),
    color: '#34495E',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: s(36),
    height: s(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(8),
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
});

export default ProductCard;