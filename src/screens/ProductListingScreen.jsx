import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActiveProductCard from '../components/ActiveProductCard';
import AddProductForm from '../components/AddProductForm';
import { fetchProductsByFarmer, addProduct, updateProduct, deleteProduct } from '../services/firestore';
import theme from '../theme/theme';
import UnifiedHeader from '../components/UnifiedHeader';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ProductListingScreen = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      // Get current farmer ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('ProductListingScreen - Farmer ID from AsyncStorage:', userToken);
      
      if (!userToken) {
        Alert.alert(t('common.error'), t('productListing.farmerNotLoggedIn'));
        return;
      }
      
      // Fetch only products belonging to this farmer
      const data = await fetchProductsByFarmer(userToken);
      console.log('Products loaded for farmer:', data.length, 'items');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products: ', error);
      Alert.alert(t('common.error'), t('productListing.failedToLoadProducts'));
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddOrUpdateProduct = async (productData) => {
    try {
      console.log('ProductListingScreen - Product data being saved:', productData);
      console.log('ProductListingScreen - Editing product:', editingProduct);
  
      if (editingProduct) {
        console.log('Updating existing product...');
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        console.log('Adding new product...');
        const productId = await addProduct(productData);
        console.log('New product added with ID:', productId);
      }
  
      Alert.alert('Success', 'Product saved successfully!');
      await loadProducts();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', error.message || 'Failed to save product');
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      Alert.alert('Success', 'Product deleted successfully!');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product: ', error);
      Alert.alert('Error', 'Failed to delete product. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <UnifiedHeader
        title="My Products"
        subtitle="Manage your farm products"
        showCartButton={false}
        notificationCount={2}
        onCartPress={() => {}}
        onNotificationPress={() => {}}
        showMenuButton={false}
        onMenuPress={() => {}}
      />
      
      <View style={styles.content}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActiveProductCard 
              product={item} 
              viewType="farmer"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Floating Action Button with Text */}
      <TouchableOpacity
        onPress={() => { 
          setEditingProduct(null);
          setShowAddForm((prev) => !prev);
        }}
        style={styles.fab}
      >
        <Icon name="plus" size={24} color="#FFF" />
        <Text style={styles.fabText}>Add Product</Text>
      </TouchableOpacity>

      {/* Modal for Add/Edit Product Form */}
      <Modal
        visible={showAddForm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowAddForm(false);
          setEditingProduct(null);
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <View style={styles.modalOverlay}>
            <AddProductForm 
              initialProduct={editingProduct} 
              onCancel={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }} 
              onSave={handleAddOrUpdateProduct} 
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  listContainer: {
    padding: theme.spacing.sm,
    paddingBottom: s(100), 
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(28),
    paddingVertical: s(12),
    paddingHorizontal: s(16),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },
  fabText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: s(8),
    fontSize: ms(16),
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export default ProductListingScreen;