import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { useTranslationUtils } from '../services/translationService';

const ProductCard = ({ product, onPress }) => {
  const { t } = useTranslation();
  const { getTranslatedProductName, getTranslatedFarmerName } = useTranslationUtils();
  
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image 
        source={{ uri: product.images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {product.onSale && (
        <View style={styles.saleBadge}>
          <Text style={styles.saleBadgeText}>{t('filters.sale')}</Text>
        </View>
      )}
      
      {product.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>{t('filters.new')}</Text>
        </View>
      )}
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{getTranslatedProductName(product.crop)}</Text>
        <Text style={styles.farmer} numberOfLines={1}>by {getTranslatedFarmerName(product.farmerName)}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.price}>₹{product.pricePerKg}/kg</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProductGrid = ({ products, onProductPress }) => {
  const { t } = useTranslation();
  
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="leaf-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyText}>{t('filters.noProductsFound')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <ProductCard 
          product={item} 
          onPress={onProductPress} 
        />
      )}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    maxWidth: '47%',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  farmer: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 2,
    fontWeight: '500',
  },
  saleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default ProductGrid;