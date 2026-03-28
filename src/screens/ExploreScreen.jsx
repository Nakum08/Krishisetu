import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Keyboard,
  FlatList,
  Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import FilterChips from '../components/FilterChips';
import TrendingSection from '../components/TrendingSection';
import ProductGrid from '../components/ProductGrid';
import SeasonalBanner from '../components/SeasonalBanner';
import AttractiveCategoryList from '../components/AttractiveCategoryList';
import PosterCarousel from '../components/PosterCarousel';
import theme from '../theme';
import UnifiedHeader from '../components/UnifiedHeader';
import { fetchProducts, fetchCategories } from '../services/firestore';
import { useTranslationUtils } from '../services/translationService';

const mockProducts = [
  {
    id: '1',
    crop: 'Organic Wheat',
    category: 'grains',
    pricePerKg: 35,
    rating: 4.8,
    images: ['https://en.pimg.jp/093/551/131/1/93551131.jpg'],
    farmerName: 'Rajesh Kumar',
    isNew: true,
    onSale: false,
  },
  {
    id: '2',
    crop: 'Premium Rice',
    category: 'grains',
    pricePerKg: 60,
    rating: 4.5,
    images: ['https://5.imimg.com/data5/IOS/Default/2021/9/XW/IW/FG/137913819/product-jpeg-1000x1000.png'],
    farmerName: 'Amit Singh',
    isNew: false,
    onSale: true,
  },
  {
    id: '3',
    crop: 'Fresh Tomatoes',
    category: 'vegetables',
    pricePerKg: 40,
    rating: 4.2,
    images: ['https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'],
    farmerName: 'Priya Sharma',
    isNew: true,
    onSale: false,
  },
  {
    id: '4',
    crop: 'Organic Potatoes',
    category: 'vegetables',
    pricePerKg: 30,
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655'],
    farmerName: 'Suresh Patel',
    isNew: false,
    onSale: false,
  },
  {
    id: '5',
    crop: 'Sweet Mangoes',
    category: 'fruits',
    pricePerKg: 120,
    rating: 4.9,
    images: ['https://images.jdmagicbox.com/quickquotes/images_main/paulmark-mango-fruit-plants-378503196-28rdm.jpeg'],
    farmerName: 'Ananya Gupta',
    isNew: false,
    onSale: true,
  },
  {
    id: '6',
    crop: 'Fresh Coconut',
    category: 'fruits',
    pricePerKg: 25,
    rating: 4.3,
    images: ['http://www.agritech.tnau.ac.in/expert_system/coconut/coconut/images/coconut_home_side_img.jpg'],
    farmerName: 'Vikram Rao',
    isNew: true,
    onSale: false,
  },
  {
    id: '7',
    crop: 'Red Chillies',
    category: 'spices',
    pricePerKg: 80,
    rating: 4.6,
    images: ['https://m.media-amazon.com/images/I/51uIDsXLbWL._SX300_SY300_QL70_FMwebp_.jpg'],
    farmerName: 'Kiran Desai',
    isNew: false,
    onSale: true,
  },
  {
    id: '8',
    crop: 'Fresh Turmeric',
    category: 'spices',
    pricePerKg: 90,
    rating: 4.7,
    images: ['https://kj1bcdn.b-cdn.net/media/52080/878daeafbe412059520dda893da4a43e.jpg'],
    farmerName: 'Neha Verma',
    isNew: true,
    onSale: false,
  },
];

const getMockCategories = (t) => [
  { id: 'vegetables', name: t('categories.vegetables'), imageUri: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7' },
  { id: 'fruits', name: t('categories.fruits'), imageUri: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b' },
  { id: 'grains', name: t('categories.grains'), imageUri: 'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7' },
  { id: 'spices', name: t('categories.spices'), imageUri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d' },
  { id: 'honey', name: t('categories.honey'), imageUri: 'https://images.unsplash.com/photo-1558642891-54be180ea339' },
];

const getCarouselData = (t) => [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399',
    title: t('banners.supportLocalFarmers'),
    subtitle: t('banners.buyDirectlyFromFarmers'),
  },
  {
    id: '2',
    imageUrl: 'https://cdn1.healthians.com/blog/wp-content/uploads/2023/10/shutterstock_225001330-950x500.jpg',
    title: t('banners.freshSeasonalProduce'),
    subtitle: t('banners.getFreshestSeasonal'),
  },
  {
    id: '3',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0569/0615/4154/files/Farmers-market-fresh-produce_1024x1024.jpg?v=1684278640',
    title: t('banners.organicNatural'),
    subtitle: t('banners.discoverOrganic'),
  },
];

const ExploreScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { translateProducts, translateCategories, getTranslatedProductName } = useTranslationUtils();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        let dbCategories = [];
        try {
          dbCategories = await fetchCategories() || [];
        } catch (error) {
          console.error("Error fetching categories from database:", error);
        }
        
        const dbCategoryIds = dbCategories.map(cat => cat.id);
        const mockCategoriesTranslated = getMockCategories(t);
        const combinedCategories = [
          ...translateCategories(dbCategories),
          ...mockCategoriesTranslated.filter(cat => !dbCategoryIds.includes(cat.id))
        ];
        
        setCategories(combinedCategories);
        
        let dbProducts = [];
        try {
          dbProducts = await fetchProducts() || [];

          // dbProducts.forEach((p, i) => {
          //   console.log(` Chipa Product ${i + 1} [${p.id}] farmerId:`, p.farmerId);
          // });
          
          dbProducts = dbProducts.map(product => ({
            ...product,
            rating: product.rating || 4.0,
            isNew: product.createdAt ? 
              new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 
              : false,
            onSale: product.onSale || false,
          }));
        } catch (error) {
          console.error("Error fetching products from database:", error);
        }
        
        const mocksWithSource = mockProducts.map(product => ({ 
          ...product,
          source: 'mock',
          mockId: product.id
        }));
        
        const dbWithSource = dbProducts.map(product => ({
          ...product,
          source: 'db'
        }));
        
        const allProducts = [...translateProducts(dbWithSource), ...mocksWithSource];
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        const trending = allProducts
          .filter(product => product.rating >= 4.5)
          .slice(0, 5);
        setTrendingProducts(trending);
      } catch (error) {
        console.error("Error loading data:", error);
        setErrorMessage("Failed to load some data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      let dbProducts = [];
      try {
        dbProducts = await fetchProducts() || [];
        
        dbProducts = dbProducts.map(product => ({
          ...product,
          rating: product.rating || 4.0,
          isNew: product.createdAt ? 
            new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 
            : false,
          onSale: product.onSale || false,
          source: 'db'
        }));
        
        const mocksWithSource = mockProducts.map(product => ({
          ...product,
          source: 'mock',
          mockId: product.id
        }));
        
        const allProducts = [...dbProducts, ...mocksWithSource];
        
        setProducts(allProducts);
        handleFilterChange(selectedFilter, allProducts);
        
        const trending = allProducts
          .filter(product => product.rating >= 4.5)
          .slice(0, 5);
        setTrendingProducts(trending);
      } catch (error) {
        console.error("Error refreshing products:", error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (filter, productList = products) => {
    setSelectedFilter(filter);
    
    switch (filter) {
      case 'Popular':
        setFilteredProducts(productList.filter(product => product.rating >= 4.5));
        break;
      case 'New':
        setFilteredProducts(productList.filter(product => product.isNew));
        break;
      case 'On Sale':
        setFilteredProducts(productList.filter(product => product.onSale));
        break;
      default:
        setFilteredProducts(productList);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      handleFilterChange(selectedFilter);
      setShowSearchResults(false);
      return;
    }
    
    const results = products.filter(product => 
      (product.crop && product.crop.toLowerCase().includes(query.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(query.toLowerCase())) ||
      (product.farmerName && product.farmerName.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredProducts(results);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleProductSelect = (product) => {
    setSearchQuery(product.crop);
    
    setSearchResults([product]);
    setShowSearchResults(true);
    
    Keyboard.dismiss();
    
    setTimeout(() => {
      searchResultsRef.current?.scrollTo({ y: 120, animated: true });
    }, 100);
  };

  const handleCategorySelect = (category) => {
    setSearchQuery(category.name);
    
    const results = products.filter(product => 
      product.category === category.id
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
    
    Keyboard.dismiss();
    
    setTimeout(() => {
      searchResultsRef.current?.scrollTo({ y: 120, animated: true });
    }, 100);
  };

  // const handleProductPress = (product) => {
  //   navigation.navigate('ProductDetails', { product });
  // };

const handleProductPress = (product) => {
  console.log("Navigating to product details with:", product);
  
  const formattedProduct = {
    id: product.id || product.mockId || Date.now().toString(),
    crop: product.crop || "Unknown Product",
    category: product.category || "uncategorized",
    pricePerKg: product.pricePerKg || 0,
    rating: product.rating || 0,
    images: product.images && product.images.length > 0 ? product.images : [],
    farmerName: product.farmerName || "Unknown Farmer",
    description: product.description || "",
  };
  
  // navigation.navigate('ProductDetailsScreen', { product: formattedProduct });

  navigation.navigate('ProductDetailsScreen', { product: product });
};

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProductsScreen', { category });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    handleFilterChange(selectedFilter);
  };

  if (loading) {
  return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loaderText}>{t('search.harvestingFreshProduce')}</Text>
    </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover fresh produce from farmers</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CustomerCart')}>
          <Ionicons name="cart-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View> */}

<UnifiedHeader
        title={t('headers.explore')}
        subtitle={t('headers.discoverFreshProduce')}
        showCartButton={true}
        cartCount={cartCount}
        notificationCount={2}
        onCartPress={() => navigation.navigate('CustomerCartScreen')}
        onNotificationPress={() => navigation.navigate('NotificationsScreen')}
        showMenuButton={false}
        onMenuPress={() => {/* Handle menu */}}
      />
      
      <EnhancedSearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        placeholder={t('search.searchForFreshProduce')}
        products={products}
        categories={categories}
        onSelectProduct={handleProductSelect}
        onSelectCategory={handleCategorySelect}
      />
      
      {showSearchResults ? (
        <ScrollView 
          ref={searchResultsRef}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        >
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                {t('search.searchResultsFor', { query: searchQuery })}
              </Text>
              <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.clearSearchText}>{t('search.clear')}</Text>
              </TouchableOpacity>
            </View>
            
            {searchResults.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={60} color="#DDDDDD" />
                <Text style={styles.noResultsText}>{t('search.noProductsFound')}</Text>
                <Text style={styles.noResultsSubText}>
                  {t('search.tryDifferentSearchTerm')}
                </Text>
              </View>
            ) : (
              <View style={styles.searchResultsGrid}>
                {searchResults.map((product) => (
                  <TouchableOpacity
                    key={product.id || product.mockId || Math.random().toString()}
                    style={styles.productCard}
                    onPress={() => {
                      console.log("Card pressed for product:", product.crop);
                      handleProductPress(product);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.imageContainer}>
                      <Image 
                        source={{ uri: product.images && product.images[0] }} 
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      {product.source === 'db' && (
                        <View style={styles.dbBadge}>
                          <Text style={styles.dbBadgeText}>DB</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {getTranslatedProductName(product.crop)}
                      </Text>
                      <Text style={styles.productPrice}>
                        ₹{product.pricePerKg}/kg
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{product.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        !isKeyboardVisible && (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id || item.mockId || Math.random().toString()}
            ListHeaderComponent={() => (
              <>
                <PosterCarousel data={getCarouselData(t)} />
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{t('filters.categories')}</Text>
                  <AttractiveCategoryList 
                    categories={categories} 
                    onCategoryPress={handleCategoryPress} 
                  />
                </View>
                
                <SeasonalBanner />
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{t('filters.trendingProducts')}</Text>
                  <TrendingSection 
                    products={trendingProducts} 
                    onProductPress={handleProductPress} 
                  />
                </View>
                
                <View style={styles.sectionContainer}>
                  <View style={styles.productHeaderRow}>
                    <Text style={styles.sectionTitle}>{t('filters.allProducts')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CustomerMain')}>
                      <Text style={styles.viewAllText}>{t('filters.viewAll')}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  ) : null}
                  
                  <FilterChips 
                    selected={selectedFilter} 
                    onSelect={handleFilterChange} 
                    filters={[t('filters.all'), t('filters.popular'), t('filters.new'), t('filters.onSale')]}
                  />
                </View>
              </>
            )}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <Text style={styles.footerText}>Support local farmers with KrishiSetu</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => handleProductPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: item.images && item.images[0] }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    {item.source === 'db' && (
                      <View style={styles.dbBadge}>
                        <Text style={styles.dbBadgeText}>DB</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.crop}
                    </Text>
                    <Text style={styles.productPrice}>
                      ₹{item.pricePerKg}/kg
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
            contentContainerStyle={styles.productsList}
          />
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  productHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
  searchResultsContainer: {
    flex: 1,
    padding: 16,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  clearSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearSearchText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  searchResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  dbBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dbBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  productsList: {
    paddingHorizontal: 16,
  },
});

export default ExploreScreen;