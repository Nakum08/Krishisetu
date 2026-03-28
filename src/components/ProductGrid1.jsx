import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.productImage} />
        {product.onSale && (
          <View style={styles.saleTag}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.farmerName} numberOfLines={1}>by {product.farmer.name}</Text>
        
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{product.pricePerKg}<Text style={styles.perKg}>/kg</Text></Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={12} color={COLORS.yellow} />
            <Text style={styles.rating}>{product.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProductGrid = ({ products, onProductPress }) => {
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="leaf-outline" size={60} color={COLORS.lightGray} />
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.gridContainer}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100, // Extra space for bottom tabs
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    maxWidth: '47%',
  },
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 6,
    borderRadius: 20,
  },
  productDetails: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  farmerName: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  perKg: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.gray,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginTop: 8,
  },
});

export default ProductGrid;