import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import theme from '../theme';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';
// Validation Schema
const productValidationSchema = Yup.object().shape({
  crop: Yup.string()
    .required('Crop name is required')
    .min(2, 'Crop name must be at least 2 characters'),
  quantity: Yup.string()
    .required('Quantity is required'),
  pricePerKg: Yup.string()
    .required('Price per kg is required'),
  nutritionInfo: Yup.string()
    .required('Nutrition information is required'),
});

const ProductForm = ({
  onSave,
  onCancel,
  selectedProductId,
  initialCategory,
  setSelectedCategory,
  initialImages,
  setImages,
  selectedImage,
  setSelectedImage,
  productToEdit
}) => {
  const { t } = useTranslation();
  const formAnimation = useRef(new Animated.Value(1)).current;
  const formRef = useRef(null);
  const categories = [t('farmer.vegetables'), t('farmer.fruits'), t('farmer.grains'), t('farmer.nuts'), t('farmer.legumes'), t('farmer.spices'), t('farmer.honey')];

  useEffect(() => {
    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleImagePicker = () => {
    console.log('Launching image picker');
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 5,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else if (response.assets) {
        console.log('Images selected:', response.assets.length);
        const selectedImages = response.assets.map(asset => asset.uri);
        setImages(prevImages => {
          const newImages = [...prevImages, ...selectedImages];
          return [...new Set(newImages)];
        });
        if (!selectedImage) {
          setSelectedImage(selectedImages[0]);
        }
      }
    });
  };

  const CustomInput = ({ label, name, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={formik.values[name]}
        onChangeText={(text) => {
          console.log(`${label} changed:`, text);
          formik.setFieldValue(name, text);
        }}
        onBlur={() => {
          formik.setFieldTouched(name);
          formik.handleBlur(name);
        }}
        placeholder={placeholder}
        style={[
          styles.input,
          formik.touched[name] && formik.errors[name] && styles.inputError
        ]}
        keyboardType={keyboardType}
      />
      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.errorText}>{formik.errors[name]}</Text>
      )}
    </View>
  );

  return (
    <Animated.View 
      ref={formRef}
      style={[
        styles.formContainer,
        {
          transform: [{
            translateY: formAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-500, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>
          {selectedProductId ? t('farmer.editProduct') : t('farmer.addNewProduct')}
        </Text>
        <TouchableOpacity 
          onPress={onCancel} 
          style={styles.closeButton}
        >
          <Icon name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t('farmer.category')}</Text>
        <Picker
          selectedValue={initialCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
        >
          <Picker.Item label={t('farmer.selectCategory')} value="" />
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <CustomInput
        label={t('farmer.cropName')}
        name="crop"
        placeholder={t('farmer.enterCropName')}
      />
      <CustomInput
        label={t('farmer.quantity')}
        name="quantity"
        placeholder={t('farmer.enterQuantity')}
        keyboardType="numeric"
      />
      <CustomInput
        label={t('farmer.pricePerKg')}
        name="pricePerKg"
        placeholder={t('farmer.enterPricePerKg')}
        keyboardType="numeric"
      />
      <CustomInput
        label={t('farmer.nutritionInfo')}
        name="nutritionInfo"
        placeholder={t('farmer.enterNutritionInfo')}
      />

      <TouchableOpacity 
        style={styles.imagePickerButton} 
        onPress={handleImagePicker}
      >
        <Icon name="image-plus" size={24} color="#FFF" />
        <Text style={styles.imagePickerText}>
          {t('farmer.selectImages')} ({initialImages.length}/5)
        </Text>
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <ScrollView horizontal style={styles.thumbnailContainer}>
            {initialImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(image)}
              >
                <Image source={{ uri: image }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={formik.handleSubmit}
      >
        <Icon 
          name={selectedProductId ? "update" : "plus"} 
          size={24} 
          color="#FFF" 
        />
        <Text style={styles.submitButtonText}>
          {selectedProductId ? t('farmer.updateProduct') : t('farmer.addProduct')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: theme.colors.background,
    margin: s(16),
    borderRadius: ms(16),
    padding: s(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  formTitle: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: s(8),
  },
  inputContainer: {
    marginBottom: s(16),
  },
  inputLabel: {
    fontSize: ms(14),
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: s(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: ms(8),
    padding: s(12),
    fontSize: ms(16),
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: ms(12),
    marginTop: s(4),
  },
  picker: {
    height: s(50),
    borderColor: '#E1E1E1',
    borderWidth: 1,
    borderRadius: ms(8),
    backgroundColor: '#F8F9FA',
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(12),
    borderRadius: ms(8),
    marginVertical: s(16),
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: '600',
    marginLeft: s(8),
  },
  selectedImageContainer: {
    marginBottom: s(16),
  },
  selectedImage: {
    width: '100%',
    height: s(200),
    borderRadius: ms(8),
    marginBottom: s(8),
  },
  thumbnailContainer: {
    paddingHorizontal: s(4),
  },
  thumbnail: {
    width: s(60),
    height: s(60),
    borderRadius: ms(4),
    marginHorizontal: s(4),
  },
  submitButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(16),
    borderRadius: ms(8),
    marginTop: s(8),
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: '600',
    marginLeft: s(8),
  },
});

export default ProductForm;