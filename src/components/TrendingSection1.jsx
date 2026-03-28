import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const TrendingSection = ({ products, onProductPress }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.trendingItem}
            onPress={() => onProductPress(product)}
          >
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            <View style={styles.overlay}>
              <View style={styles.badgeContainer}>
                {product.organic && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Organic</Text>
                  </View>
                )}
                {product.onSale && (
                  <View style={[styles.badge, styles.saleBadge]}>
                    <Text style={styles.badgeText}>Sale</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{product.pricePerKg}/kg</Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color={COLORS.yellow} />
                    <Text style={styles.rating}>{product.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 8,
  },
  trendingItem: {
    width: 220,
    height: 180,
    borderRadius: SIZES.radius,
    marginRight: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: SIZES.radius,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  saleBadge: {
    backgroundColor: COLORS.red,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  productInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
});

export default TrendingSection;