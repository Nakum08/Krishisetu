import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const TrendingProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image 
        source={{ uri: product.images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>{product.crop}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.pricePerKg}/kg</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.rating}>{product.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TrendingSection = ({ products, onProductPress }) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <TrendingProductCard
            key={product.id}
            product={product}
            onPress={onProductPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: s(8),
  },
  scrollContent: {
    paddingLeft: s(16),
    paddingRight: s(8),
  },
  card: {
    width: s(160),
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    marginRight: s(12),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: s(120),
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    padding: s(12),
  },
  productName: {
    fontSize: ms(14),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: s(6),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: ms(14),
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: s(6),
    paddingVertical: s(2),
    borderRadius: ms(4),
  },
  rating: {
    fontSize: ms(12),
    color: theme.colors.text,
    marginLeft: s(2),
  },
});

export default TrendingSection; 