import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';
import theme from '../theme';
import { useProductFormik } from '../validation/productFormik';
import { fetchProductsByFarmer, deleteProduct, seedSampleProducts } from '../services/firestore';
import { useTranslation } from 'react-i18next'; 
import { s, ms, wp, hp, vs } from '../utils/responsive';
const ProductManagement = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetForm = () => {
    console.log('Resetting form');
    setSelectedProductId(null);
    setImages([]);
    setSelectedImage(null);
    setSelectedCategory('');
  };

  const loadProducts = async () => {
    console.log('Loading products from Firestore...');
    setIsLoading(true);
    try {
      // Get current farmer ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Farmer ID from AsyncStorage:', userToken);
      
      let productsData = [];
      
      if (userToken) {
        // Try to fetch from database first
        try {
          productsData = await fetchProductsByFarmer(userToken);
          console.log('Products loaded from database:', productsData.length, 'items');
        } catch (dbError) {
          console.log('Database fetch failed:', dbError.message);
        }
      }
      
      // If no products from database, show empty state
      if (productsData.length === 0) {
        console.log('No products found, showing empty state');
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useProductFormik(
    selectedProductId,
    images,
    selectedCategory,
    loadProducts,
    resetForm
  );

  useEffect(() => {
    console.log('Component mounted - Loading initial data');
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId && products.length > 0) {
      const productToEdit = products.find(p => p.id === selectedProductId);
      if (productToEdit) {
        formik.setValues({
          crop: productToEdit.crop || '',
          quantity: productToEdit.quantity || '',
          pricePerKg: productToEdit.pricePerKg || '',
          nutritionInfo: productToEdit.nutritionInfo || '',
          category: productToEdit.category || '',
        });
        setImages(productToEdit.images || []);
        setSelectedImage(productToEdit.images?.[0] || null);
        setSelectedCategory(productToEdit.category || '');
      }
    }
  }, [selectedProductId, products]);

  const handleEditProduct = (product) => {
    console.log('Editing product:', product.id);
    setSelectedProductId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    console.log('Deleting product:', productId);
    try {
      await deleteProduct(productId);
      await loadProducts();
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product. Please try again.');
    }
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      t('farmer.confirmDelete'),
      t('farmer.confirmDeleteMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('farmer.delete'),
          onPress: () => handleDeleteProduct(productId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSeedSampleProducts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'Please sign in first');
        return;
      }

      Alert.alert(
        t('farmer.seedSampleProducts'),
        t('farmer.seedSampleProductsMessage'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('farmer.seedProducts'),
            onPress: async () => {
              try {
                const count = await seedSampleProducts(userToken);
                Alert.alert(t('common.success'), t('farmer.sampleProductsAdded', { count }));
                await loadProducts(); // Reload the products list
              } catch (error) {
                Alert.alert(t('common.error'), t('farmer.failedToSeedProducts'));
                console.error('Error seeding products:', error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get user information');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('farmer.products')}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.headerButton, styles.seedButton]}
              onPress={handleSeedSampleProducts}
            >
              <Icon name="database-plus" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, styles.addButton]}
              onPress={() => {
                resetForm();
                formik.resetForm();
                setShowForm(true);
              }}
            >
              <Icon name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {showForm && (
          <ProductForm
            formik={formik}
            onCancel={() => setShowForm(false)}
            selectedProductId={selectedProductId}
            initialCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            initialImages={images}
            setImages={setImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>{t('farmer.loadingProducts')}</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                onEdit={() => handleEditProduct(item)}
                onDelete={() => confirmDelete(item.id)}
              />
            )}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>{t('farmer.noProductsFound')}</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  title: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  headerButton: {
    width: s(44),
    height: s(44),
    borderRadius: ms(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedButton: {
    backgroundColor: '#FF9800',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  productsList: {
    paddingBottom: s(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(50),
  },
  emptyText: {
    fontSize: ms(16),
    color: theme.colors.textSecondary,
  }
});

export default ProductManagement;

