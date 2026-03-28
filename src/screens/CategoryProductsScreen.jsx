import React, { useState, useEffect, useCallback } from 'react';
import { 
  SafeAreaView, 
  FlatList, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchActiveProductsByCategory } from '../services/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { s, ms, wp, hp, vs } from '../utils/responsive';



const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 220;

const CategoryProductsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params; 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(t('filters.all'));
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  const filterOptions = [t('filters.all'), t('filters.popular'), t('filters.new'), t('filters.onSale')];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);  
        
        const productsList = await fetchActiveProductsByCategory(category.id);
        console.log(`Found ${productsList.length} products for category: ${category.id}`);

        // productsList.forEach((p, idx) => {
        //   console.log(`Viral Product ${idx}:`, p.farmerId);
        // });
        
        setProducts(productsList);
        setError(null);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
  }, []);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCartItems = await AsyncStorage.getItem('cartItems');
        if (storedCartItems) {
          const items = JSON.parse(storedCartItems);
          setCartItems(items);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };
    
    loadCartItems();
  }, []);

  const toggleFavorite = useCallback(async (product) => {
    try {
      const newFavorites = [...favorites];
      const index = newFavorites.findIndex(item => item.id === product.id);
      
      if (index >= 0) {
        newFavorites.splice(index, 1);
      } else {
        newFavorites.push(product);
      }
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  }, [favorites]);

  const toggleCart = useCallback(async (product) => {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      let items = storedCartItems ? JSON.parse(storedCartItems) : [];
      
      const existingIndex = items.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        items.splice(existingIndex, 1);
      } else {
        items.push({
          product: product,
          quantity: 1
        });
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
      
      setCartItems(items);
      
    } catch (error) {
      console.error('Error toggling cart item:', error);
    }
  }, [cartItems]);

  const renderProduct = ({ item, index }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const isInCart = cartItems.some(cartItem => cartItem.product.id === item.id);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? 0 : 10 }]} 
      onPress={() => navigation.navigate('ProductDetailsScreen', { product: item })}
      activeOpacity={0.8}
    > 
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: (item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
        />
        {item.isOnSale && (
          <View style={styles.saleTag}>
            <Text style={styles.saleText}>{t('filters.sale')}</Text>
          </View>
        )}
        <View style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonActive
        ]}>
          <TouchableOpacity 
            onPress={() => toggleFavorite(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.heartButton}
          >
            <Icon 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "#FF3B5C" : theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name || item.crop}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>
            ₹{item.pricePerKg ? item.pricePerKg.toFixed(2) : '0.00'}
          </Text>
          <TouchableOpacity 
            onPress={() => toggleCart(item)}
            style={[
              styles.cartIconButton,
              isInCart && styles.cartIconButtonActive
            ]}
          >
            <Icon 
              name={isInCart ? "cart" : "cart-outline"} 
              size={20} 
              color={isInCart ? "#00C853" : theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  };

  const renderFilterOption = (option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.filterOption,
        selectedFilter === option && styles.filterOptionSelected
      ]}
      onPress={() => setSelectedFilter(option)}
    >
      <Text 
        style={[
          styles.filterText, 
          selectedFilter === option && styles.filterTextSelected
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.stickyHeader}>
          <Image source={{ uri: category.imageUri }} style={styles.headerImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonContainer}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.productCount}>{products.length} {t('filters.products')}</Text>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          {/* Filter Options */}
          <View style={styles.filterContainer}>
            {filterOptions.map(renderFilterOption)}
          </View>

          {/* Products */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Icon name="alert-circle-outline" size={40} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  // Re-fetch products logic here
                }}
              >
                <Text style={styles.retryText}>{t('common.tryAgain')}</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Icon name="basket-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>{t('categoryProducts.noProductsFound')}</Text>
              <TouchableOpacity 
                style={styles.browseButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.browseText}>{t('categoryProducts.browseCategories')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  stickyHeader: {
    height: HEADER_HEIGHT,
    width: '100%',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: s(38),
    height: s(38),
    borderRadius: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  categoryName: {
    fontSize: ms(28),
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: s(5),
  },
  productCount: {
    fontSize: ms(16),
    color: 'rgba(255,255,255,0.85)',
  },
  contentContainer: {
    flex: 1,
    paddingTop: s(15),
    backgroundColor: '#fff',
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    marginTop: -20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingTop: s(8),
    paddingHorizontal: s(20),
    marginBottom: s(15),
  },
  filterOption: {
    paddingVertical: s(8),
    paddingHorizontal: s(16),
    borderRadius: ms(20),
    marginRight: s(10),
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: ms(14),
    color: theme.colors.textSecondary,
  },
  filterTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContent: {
    padding: s(20),
    paddingTop: s(5),
  },
  productCard: {
    flex: 1,
    maxWidth: (width - 50) / 2,
    backgroundColor: '#FFF',
    borderRadius: ms(12),
    marginBottom: s(20),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: s(160),
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
  },
  saleTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: theme.colors.error,
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: ms(4),
  },
  saleText: {
    color: '#FFF',
    fontSize: ms(10),
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: s(32),
    height: s(32),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,240,245,0.95)',
  },
  productInfo: {
    padding: s(12),
  },
  productName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#ff6b6b', // Corrected to use a valid hex color value
  },
  cartIconButton: {
    width: s(32),
    height: s(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(239, 245, 238, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 2,
  },
  cartIconButtonActive: {
    backgroundColor: 'rgba(240,255,240,0.95)', // Light green background when active
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  loadingText: {
    fontSize: ms(18),
    color: theme.colors.textPrimary,
  },
  errorText: {
    fontSize: ms(16),
    color: theme.colors.error,
  },
  retryButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: ms(10),
  },
  retryText: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyText: {
    fontSize: ms(16),
    color: theme.colors.textSecondary,
    marginBottom: s(20),
  },
  browseButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: ms(10),
  },
  browseText: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#FFF',
  },
  heartButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryProductsScreen;
