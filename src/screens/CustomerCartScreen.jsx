import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslationUtils } from '../services/translationService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import theme from '../theme';
import LinearGradient from 'react-native-linear-gradient';
import UnifiedHeader from '../components/UnifiedHeader';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const Tab = createMaterialTopTabNavigator();

// Favorites Tab Component
const FavoritesTab = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Load favorites each time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          setLoading(true);
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadFavorites();
    }, [])
  );

  const removeFromFavorites = async (productId) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== productId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetailsScreen', { product });
  };

  const renderFavoriteItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.favoriteContent}>
        <Image 
          source={{ uri: (item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name || item.crop}</Text>
          <Text style={styles.productCategory}>
            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : t('favorites.product')}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              ₹{item.pricePerKg ? item.pricePerKg.toFixed(2) : '0.00'}
            </Text>
            <Text style={styles.perKg}>{t('favorites.perKg')}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Icon name="heart-dislike-outline" size={18} color="#FF3B5C" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Empty state component
  const EmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>{t('favorites.noFavoritesYet')}</Text>
      <Text style={styles.emptyText}>
        {t('favorites.itemsWillAppearHere')}
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('ExploreScreen')}
      >
        <Text style={styles.browseButtonText}>{t('favorites.browseProducts')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <>
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.summaryContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              style={styles.summaryGradient}
            />
            <View style={styles.summaryContent}>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryText}>
                  {favorites.length} {favorites.length === 1 ? t('favorites.item') : t('favorites.items')} {t('favorites.inFavorites')}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={() => navigation.jumpTo('Cart')}
              >
                <Text style={styles.checkoutText}>{t('buttons.buyNow')}</Text>
                <Icon name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// Cart Tab Component
const CartTab = () => {
  const { t } = useTranslation();
  const { getTranslatedProductName } = useTranslationUtils();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  // Load cart items
  useFocusEffect(
    useCallback(() => {
      const loadCartItems = async () => {
        try {
          setLoading(true);
          const storedCartItems = await AsyncStorage.getItem('cartItems');
          if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
          }
        } catch (error) {
          console.error('Error loading cart items:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadCartItems();
    }, [])
  );
  
  const removeFromCart = async (productId) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.product.id !== productId);
      setCartItems(updatedCartItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity below 1
    
    try {
      const updatedCartItems = cartItems.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      setCartItems(updatedCartItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.pricePerKg * item.quantity);
    }, 0);
  };
  
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <Image
        source={{ 
          uri: (item.product.images && item.product.images.length > 0) 
            ? item.product.images[0] 
            : 'https://via.placeholder.com/150' 
        }}
        style={styles.cartItemImage}
      />
      
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{getTranslatedProductName(item.product.name || item.product.crop)}</Text>
        <Text style={styles.cartItemCategory}>
          {item.product.category 
            ? item.product.category.charAt(0).toUpperCase() + item.product.category.slice(1) 
            : t('favorites.product')}
        </Text>
        <Text style={styles.cartItemPrice}>
          ₹{item.product.pricePerKg ? item.product.pricePerKg.toFixed(2) : '0.00'} {t('favorites.perKg')}
        </Text>
      </View>
      
      <View style={styles.cartItemActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Icon name="remove" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Icon name="add" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromCart(item.product.id)}
        >
          <Icon name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Empty cart component
  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>{t('cart.empty')}</Text>
      <Text style={styles.emptyText}>
        {t('cart.addItems')}
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('ExploreScreen')}
      >
        <Text style={styles.browseButtonText}>{t('buttons.viewDetails')}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.tabContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.summaryContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              style={styles.summaryGradient}
            />
            <View style={styles.summaryContent}>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryText}>
                  {t('favorites.total')} <Text style={styles.totalPrice}>₹{calculateTotal().toFixed(2)}</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>{t('cart.checkout')}</Text>
                <Icon name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// Main Component with Tabs
const CustomerCartScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <UnifiedHeader
        title={t('cart.title')}
        subtitle={t('cart.title')}
        showSearchButton={true}
        onBackPress={() => navigation.goBack()}
        onSearchPress={() => {/* Handle search */}}
      />
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: s(3),
            borderRadius: ms(3),
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesTab} 
          options={{
            title: t('cart.title'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="heart" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Cart" 
          component={CartTab} 
          options={{
            title: t('navigation.cart'),
            tabBarIcon: ({ color, size }) => (
              <Icon name="cart" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: ms(22),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: s(15),
  },
  listContent: {
    paddingHorizontal: s(20),
    paddingTop: s(10),
    paddingBottom: s(100),
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: ms(16),
    marginBottom: s(16),
    padding: s(12),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: s(80),
    height: s(80),
    borderRadius: ms(10),
    backgroundColor: '#f5f5f5',
  },
  productDetails: {
    flex: 1,
    marginLeft: s(16),
  },
  productName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  productCategory: {
    fontSize: ms(14),
    color: theme.colors.textSecondary,
    marginBottom: s(8),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productPrice: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#FF3B5C',
  },
  perKg: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginLeft: s(4),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: s(12),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  removeButton: {
    width: s(40),
    height: s(40),
    borderRadius: ms(20),
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0E5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(40),
  },
  emptyTitle: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: s(20),
    marginBottom: s(10),
  },
  emptyText: {
    fontSize: ms(16),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: s(30),
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: s(12),
    paddingHorizontal: s(30),
    borderRadius: ms(10),
  },
  browseButtonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: s(10),
    fontSize: ms(16),
    color: theme.colors.textSecondary,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: s(90),
  },
  summaryGradient: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: s(40),
  },
  summaryContent: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryText: {
    fontSize: ms(16),
    color: theme.colors.textSecondary,
  },
  totalPrice: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: '#FF3B5C',
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(12),
    paddingHorizontal: s(20),
    borderRadius: ms(10),
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: s(8),
  },
  cartItemCard: {
    backgroundColor: '#fff',
    borderRadius: ms(16),
    marginBottom: s(16),
    padding: s(12),
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
  },
  cartItemImage: {
    width: s(70),
    height: s(70),
    borderRadius: ms(8),
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: s(12),
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: s(4),
  },
  cartItemCategory: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginBottom: s(4),
  },
  cartItemPrice: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#FF3B5C',
  },
  cartItemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: s(8),
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: ms(8),
    marginBottom: s(10),
  },
  quantityButton: {
    width: s(28),
    height: s(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: ms(14),
    fontWeight: '600',
    paddingHorizontal: s(8),
    minWidth: s(30),
    textAlign: 'center',
  },
  deleteButton: {
    padding: s(6),
  },
});

export default CustomerCartScreen;
