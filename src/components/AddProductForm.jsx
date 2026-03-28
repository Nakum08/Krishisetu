import React, { useState,useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, Platform, SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productValidationSchema } from '../validation/productValidation';
import theme from '../theme';
import ImagePickerField from './ImagePickerField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const categories = ['Vegetables', 'Fruits', 'Grains', 'Nuts', 'Legumes', 'Spices', 'Honey'];
const types = ['Organic', 'Hybrid', 'Conventional'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AddProductForm = ({ initialProduct = null, onCancel, onSave }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState(initialProduct ? initialProduct.images || [] : []);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'nutrition', 'details'

  const formik = useFormik({
    initialValues: {
      category: initialProduct?.category || '',
      crop: initialProduct?.crop || '',
      pricePerKg: initialProduct?.pricePerKg?.toString() || '',
      quantity: initialProduct?.quantity?.toString() || '',
      farmerName: initialProduct?.farmerName || '',
      type: initialProduct?.type || '',
      harvestDate: initialProduct?.harvestDate || '',
      farmStory: initialProduct?.farmStory || '',
      seasonalAvailability: initialProduct?.seasonalAvailability || [],
      nutrition: {
        calories: initialProduct?.nutrition?.calories?.toString() || '',
        protein: initialProduct?.nutrition?.protein?.toString() || '',
        carbohydrates: initialProduct?.nutrition?.carbohydrates?.toString() || '',
        fiber: initialProduct?.nutrition?.fiber?.toString() || '',
        fat: initialProduct?.nutrition?.fat?.toString() || '',
      },
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      if (images.length === 0) {
        Alert.alert(t('common.error'), t('addProduct.selectAtLeastOneImage'));
        return;
      }
      
      try {
        // Get current farmer ID from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('AddProductForm - Farmer ID from AsyncStorage:', userToken);
        
        if (!userToken) {
          Alert.alert(t('common.error'), t('addProduct.farmerNotLoggedIn'));
          return;
        }
        
        const productData = {
          ...values,
          pricePerKg: Number(values.pricePerKg),
          quantity: Number(values.quantity),
          images,
          farmerId: userToken, 
          rating: initialProduct?.rating || 4.5,
          nutrition: {
            calories: Number(values.nutrition.calories) || 0,
            protein: Number(values.nutrition.protein) || 0,
            carbohydrates: Number(values.nutrition.carbohydrates) || 0,
            fiber: Number(values.nutrition.fiber) || 0,
            fat: Number(values.nutrition.fat) || 0,
          },
        };

        console.log('Submitting product data:', productData);
        await onSave(productData);
      } catch (error) {
        console.error('Form submission error:', error);
        Alert.alert(t('common.error'), error.message || t('addProduct.failedToSaveProduct'));
      }
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={[styles.pickerContainer, formik.touched.category && formik.errors.category && styles.inputError]}>
                <Picker
                  selectedValue={formik.values.category}
                  onValueChange={(value) => formik.setFieldValue('category', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
              {formik.touched.category && formik.errors.category && (
                <Text style={styles.errorText}>{formik.errors.category}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Crop Name</Text>
              <TextInput 
                style={[styles.input, formik.touched.crop && formik.errors.crop && styles.inputError]} 
                placeholder="Crop Name"
                value={formik.values.crop} 
                onChangeText={formik.handleChange('crop')}
                onBlur={formik.handleBlur('crop')}
              />
              {formik.touched.crop && formik.errors.crop && (
                <Text style={styles.errorText}>{formik.errors.crop}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Farmer Name</Text>
              <TextInput 
                style={[styles.input, formik.touched.farmerName && formik.errors.farmerName && styles.inputError]} 
                placeholder="Farmer Name"
                value={formik.values.farmerName} 
                onChangeText={formik.handleChange('farmerName')}
                onBlur={formik.handleBlur('farmerName')}
              />
              {formik.touched.farmerName && formik.errors.farmerName && (
                <Text style={styles.errorText}>{formik.errors.farmerName}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={[styles.pickerContainer, formik.touched.type && formik.errors.type && styles.inputError]}>
                <Picker
                  selectedValue={formik.values.type}
                  onValueChange={(value) => formik.setFieldValue('type', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Type" value="" />
                  {types.map((type) => (
                    <Picker.Item key={type} label={type} value={type.toLowerCase()} />
                  ))}
                </Picker>
              </View>
              {formik.touched.type && formik.errors.type && (
                <Text style={styles.errorText}>{formik.errors.type}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price per Kg (₹)</Text>
              <TextInput 
                style={[styles.input, formik.touched.pricePerKg && formik.errors.pricePerKg && styles.inputError]} 
                placeholder="Price per Kg"
                keyboardType="numeric"
                value={formik.values.pricePerKg} 
                onChangeText={formik.handleChange('pricePerKg')}
                onBlur={formik.handleBlur('pricePerKg')}
              />
              {formik.touched.pricePerKg && formik.errors.pricePerKg && (
                <Text style={styles.errorText}>{formik.errors.pricePerKg}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity (kg)</Text>
              <TextInput 
                style={[styles.input, formik.touched.quantity && formik.errors.quantity && styles.inputError]} 
                placeholder="Quantity"
                keyboardType="numeric"
                value={formik.values.quantity} 
                onChangeText={formik.handleChange('quantity')}
                onBlur={formik.handleBlur('quantity')}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <Text style={styles.errorText}>{formik.errors.quantity}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Harvest Date</Text>
              <TextInput 
                style={[styles.input, formik.touched.harvestDate && formik.errors.harvestDate && styles.inputError]} 
                placeholder="YYYY-MM-DD"
                value={formik.values.harvestDate} 
                onChangeText={formik.handleChange('harvestDate')}
                onBlur={formik.handleBlur('harvestDate')}
              />
              {formik.touched.harvestDate && formik.errors.harvestDate && (
                <Text style={styles.errorText}>{formik.errors.harvestDate}</Text>
              )}
            </View>
          </>
        );

      case 'nutrition':
        return (
          <>
            <Text style={styles.sectionTitle}>Nutrition Info (per 100g)</Text>
            {['calories', 'protein', 'carbohydrates', 'fiber', 'fat'].map((key) => (
              <View style={styles.formGroup} key={key}>
                <Text style={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {key === 'calories' ? ' (kcal)' : ' (g)'}
                </Text>
                <TextInput 
                  style={styles.input}
                  placeholder={`Enter ${key}`}
                  keyboardType="numeric"
                  value={formik.values.nutrition[key]}
                  onChangeText={(val) =>
                    formik.setFieldValue('nutrition', { ...formik.values.nutrition, [key]: val })
                  }
                />
              </View>
            ))}
          </>
        );

      case 'details':
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Farm Story</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell the story behind your farm and this product..."
                multiline
                numberOfLines={5}
                value={formik.values.farmStory}
                onChangeText={formik.handleChange('farmStory')}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Seasonal Availability</Text>
              <View style={styles.monthsGrid}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthChip,
                      formik.values.seasonalAvailability.includes(month) && styles.selectedMonth,
                    ]}
                    onPress={() => {
                      const selected = formik.values.seasonalAvailability;
                      const updated = selected.includes(month)
                        ? selected.filter((m) => m !== month)
                        : [...selected, month];
                      formik.setFieldValue('seasonalAvailability', updated);
                    }}
                  >
                    <Text 
                      style={[
                        styles.monthText,
                        formik.values.seasonalAvailability.includes(month) && styles.selectedMonthText,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Images</Text>
              <ImagePickerField images={images} setImages={setImages} maxImages={5} />
              {images.length === 0 && (
                <Text style={styles.helperText}>
                  Please select at least one image for your product
                </Text>
              )}
            </View>
            
            <View style={styles.keyboardSpacer} />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{initialProduct ? 'Edit Product' : 'Add New Product'}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'basic' && styles.activeTab]} 
            onPress={() => setActiveTab('basic')}
          >
            <Ionicons 
              name="information-circle" 
              size={22} 
              color={activeTab === 'basic' ? theme.colors.primary : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
              Basic
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]} 
            onPress={() => setActiveTab('nutrition')}
          >
            <Ionicons 
              name="nutrition" 
              size={22} 
              color={activeTab === 'nutrition' ? theme.colors.primary : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'details' && styles.activeTab]} 
            onPress={() => setActiveTab('details')}
          >
            <Ionicons 
              name="images" 
              size={22} 
              color={activeTab === 'details' ? theme.colors.primary : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
              Details
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          {renderTabContent()}
        </ScrollView>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={formik.handleSubmit}
          >
            <Text style={styles.buttonText}>{initialProduct ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.md,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: '#fff',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthChip: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedMonth: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  selectedMonthText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  cancelButton: {
    backgroundColor: '#888',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  keyboardSpacer: {
    height: Platform.OS === 'ios' ? 100 : 150, 
  },
});

export default AddProductForm;