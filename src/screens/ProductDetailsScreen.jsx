import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
  StyleSheet,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import BulkOrderModal from '../components/BulkOrderModal';
import ImageCarousel from '../components/ImageCarousel';
import ImageThumbnails from '../components/ImageThumbnails';
import ProductInfo from '../components/ProductInfo';
import NutritionInfo from '../components/NutritionInfo';
import Certifications from '../components/Certifications';
import SeasonalAvailability from '../components/SeasonalAvailability';
import FarmStory from '../components/FarmStory';
import BottomBar from '../components/BottomBar';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const product = (route?.params?.product) || {
    images: [],
    crop: 'Product Name',
    pricePerKg: 0,
    sellerName: 'Unknown Seller',
    id: '0',
    nutritionInfo: {
      calories: '52 kcal',
      protein: '1.1 g', 
      carbs: '11.4 g',
      fiber: '2.1 g',
      fat: '0.3 g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
    },
    farmingMethod: 'Organic',
    harvestedDate: '21 Mar 2025',
    rating: 0,
    seasonsAvailable: ['Summer', 'Monsoon'],
    foodPairings: ['Salad', 'Curry', 'Soup'],
    sustainabilityScore: 9.2,
    carbonFootprint: '0.3 kg CO₂e',
    waterUsage: '35 liters/kg',
    bulkMinimumQuantity: 10, 
    bulkDiscountPercentage: 8, 
    samplePrice: 50, 
  };
  console.log("VR Product Details Screen:", product.farmerId);
  
  
  const processedProduct = {
    ...product,
    sellerName: product.farmerName || product.sellerName || 'Unknown Seller',
    farmingMethod: product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'Organic',
    harvestedDate: product.harvestDate || 'Recent',
    nutritionInfo: {
      calories: product.nutrition?.calories ? `${product.nutrition.calories} kcal` : '0 kcal',
      protein: product.nutrition?.protein ? `${product.nutrition.protein} g` : '0 g',
      carbs: product.nutrition?.carbohydrates ? `${product.nutrition.carbohydrates} g` : '0 g',
      fiber: product.nutrition?.fiber ? `${product.nutrition.fiber} g` : '0 g',
      fat: product.nutrition?.fat ? `${product.nutrition.fat} g` : '0 g',
      vitamins: product.vitamins || ['Vitamin C', 'Vitamin K', 'Folate'] 
    },
    seasonsAvailable: translateMonthsToSeasons(product.seasonalAvailability || []),
    seasonalMonths: product.seasonalAvailability || [],
  };

  function translateMonthsToSeasons(months) {
    const seasons = new Set();
    
    months.forEach(month => {
      if (['Dec', 'Jan', 'Feb'].includes(month)) {
        seasons.add('Winter');
      } else if (['Mar', 'Apr', 'May'].includes(month)) {
        seasons.add('Spring');
      } else if (['Jun', 'Jul', 'Aug'].includes(month)) {
        seasons.add('Summer');
      } else if (['Sep', 'Oct', 'Nov'].includes(month)) {
        seasons.add('Monsoon');
      }
    });
    
    return Array.from(seasons);
  }
  
  const images = processedProduct.images || [];
  const flatListRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(processedProduct.bulkMinimumQuantity || 10);
  const [orderType, setOrderType] = useState('regular'); 
  const [sampleBeforeBulk, setSampleBeforeBulk] = useState(false); 
  
  const getRegularPrice = () => processedProduct.pricePerKg * quantity;
  const getSamplePrice = () => processedProduct.samplePrice || processedProduct.pricePerKg;
  const getBulkPrice = () => {
    const discount = 1 - (processedProduct.bulkDiscountPercentage || 0) / 100;
    return (processedProduct.pricePerKg * bulkQuantity * discount).toFixed(2);
  };
  
  const getCurrentPrice = () => {
    switch(orderType) {
      case 'sample':
        return getSamplePrice();
      case 'bulk':
        return getBulkPrice();
      default:
        return getRegularPrice();
    }
  };
  
  const handleImageChange = (index) => {
    setActiveImageIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const toggleOrderType = (type) => {
    if (type === 'bulk') {
      setShowSampleModal(true);
    } else {
      setOrderType(type);
    }
  };

  const handleBulkOrderFlow = (wantSample) => {
    setShowSampleModal(false);
    
    if (wantSample) {
      setSampleBeforeBulk(true);
      setOrderType('sample');
    } else {
      setOrderType('bulk');
      setShowBulkOrderModal(true);
    }
  };

  const SampleOrderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSampleModal}
      onRequestClose={() => setShowSampleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Try a Sample First?</Text>
            <TouchableOpacity onPress={() => setShowSampleModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sampleInfoText}>
            Would you like to try a 1kg sample (₹{getSamplePrice()}) before placing a bulk order?
          </Text>
          
          <View style={styles.sampleOptionsContainer}>
            <TouchableOpacity 
              style={styles.sampleOptionButton}
              onPress={() => handleBulkOrderFlow(true)}
            >
              <Text style={styles.sampleOptionButtonText}>Yes, try a sample first</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sampleOptionButton, styles.bulkOptionButton]}
              onPress={() => handleBulkOrderFlow(false)}
            >
              <Text style={styles.sampleOptionButtonText}>No, place bulk order directly</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleAddToCart = () => {
    if (orderType === 'sample' && sampleBeforeBulk) {
      Alert.alert(
        'Sample Order',
        'After trying the sample, would you like to place a bulk order?',
        [
          {
            text: 'Yes, place bulk order',
            onPress: () => {
              setOrderType('bulk');
              setShowBulkOrderModal(true);
            },
          },
          {
            text: 'No, just the sample',
            onPress: () => {
              navigation.navigate('OrderScreen', {
                product: processedProduct,
                quantity: 1,
                orderType: 'sample',
                totalPrice: getSamplePrice(),
              });
            },
          },
        ]
      );
    } else {
      navigation.navigate('OrderScreen', {
        product: processedProduct,
        quantity: orderType === 'regular' ? quantity : orderType === 'bulk' ? bulkQuantity : 1,
        orderType: orderType,
        totalPrice: getCurrentPrice(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Sample Order Modal */}
      <SampleOrderModal />

      {/* Bulk Order Modal */}
      <BulkOrderModal
        showBulkOrderModal={showBulkOrderModal}
        setShowBulkOrderModal={setShowBulkOrderModal}
        product={processedProduct}
        bulkQuantity={bulkQuantity}
        setBulkQuantity={setBulkQuantity}
        getBulkPrice={getBulkPrice}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image Carousel */}
        <ImageCarousel
          images={images}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          flatListRef={flatListRef}
          product={processedProduct}
        />

        {/* Image Thumbnails */}
        <ImageThumbnails
          images={images}
          activeImageIndex={activeImageIndex}
          handleImageChange={handleImageChange}
        />

        {/* Product Info Section */}
        <ProductInfo
          product={processedProduct}
          orderType={orderType}
          quantity={quantity}
          setQuantity={setQuantity}
          toggleOrderType={toggleOrderType}
          getCurrentPrice={getCurrentPrice}
          getSamplePrice={getSamplePrice}
          showSampleOption={false} 
        />

        {/* Nutrition Information Section */}
        <NutritionInfo
          expanded={expanded}
          setExpanded={setExpanded}
          product={processedProduct}
        />

        {/* Certifications Section */}
        <Certifications
          showCertifications={showCertifications}
          setShowCertifications={setShowCertifications}
        />

        {/* Seasonal Availability */}
        <SeasonalAvailability product={processedProduct} />

        {/* Farm Story */}
        <FarmStory farmStory={processedProduct.farmStory} />

        <View style={{ height: s(20) }} />
      </ScrollView>
      
      {/* Fixed Bottom Bar */}
      <BottomBar
        getCurrentPrice={getCurrentPrice}
        orderType={orderType}
        navigation={navigation}
        product={processedProduct}
        quantity={orderType === 'regular' ? quantity : orderType === 'bulk' ? bulkQuantity : 1}
        onButtonPress={handleAddToCart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    padding: s(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  modalTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#333',
  },
  sampleInfoText: {
    fontSize: ms(16),
    color: '#333',
    marginBottom: s(16),
    lineHeight: 22,
  },
  sampleOptionsContainer: {
    marginTop: s(10),
  },
  sampleOptionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: s(14),
    borderRadius: ms(8),
    alignItems: 'center',
    marginBottom: s(12),
  },
  bulkOptionButton: {
    backgroundColor: '#0277bd',
  },
  sampleOptionButtonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: '500',
  },
});

export default ProductDetailsScreen;