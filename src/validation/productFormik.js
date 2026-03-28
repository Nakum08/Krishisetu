import { useFormik } from 'formik';
import { productValidationSchema } from './productValidation';
import { addProduct, updateProduct } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react'; // Add this import

export const useProductFormik = (selectedProductId, images, selectedCategory, loadProducts, resetForm) => {
  const initialValues = {
    crop: '',
    quantity: '',
    pricePerKg: '',
    nutritionInfo: '',
  };

  return useFormik({
    initialValues,
    validationSchema: productValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Get current farmer ID from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('ProductForm - Farmer ID from AsyncStorage:', userToken);
        
        if (!userToken) {
          throw new Error('Farmer not logged in. Please sign in again.');
        }
        
        const productData = {
          ...values,
          images,
          category: selectedCategory,
          farmerId: userToken, // Add farmer ID to product data
        };
        
        if (selectedProductId) {
          await updateProduct(selectedProductId, productData);
        } else {
          await addProduct(productData);
        }
        resetForm();
        loadProducts();
      } catch (error) {
        console.error('Error saving product:', error);
        throw error;
      }
    },
  });
};