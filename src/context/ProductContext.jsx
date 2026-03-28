import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProductsByFarmer, addProduct, updateProduct, deleteProduct } from '../services/firestore';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Get current farmer ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('ProductContext - Farmer ID from AsyncStorage:', userToken);
      
      if (!userToken) {
        console.error('Farmer not logged in');
        setProducts([]);
        return;
      }
      
      // Fetch only products belonging to this farmer
      const productList = await fetchProductsByFarmer(userToken);
      console.log('Products loaded for farmer in context:', productList.length, 'items');
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = async (productData) => {
    await addProduct(productData);
    loadProducts();
  };

  const updateExistingProduct = async (id, productData) => {
    await updateProduct(id, productData);
    loadProducts();
  };

  const deleteExistingProduct = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <ProductContext.Provider value={{ products, loading, addNewProduct, updateExistingProduct, deleteExistingProduct }}>
      {children}
    </ProductContext.Provider>
  );
}; 