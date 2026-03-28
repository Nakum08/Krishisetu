import React from 'react';
import { View, FlatList, Image, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images, activeImageIndex, setActiveImageIndex, flatListRef, product }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          const isProductFavorite = favorites.some(item => item.id === product.id);
          setIsFavorite(isProductFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [product.id]);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (isFavorite) {
        favorites = favorites.filter(item => item.id !== product.id);
      } else {
        favorites.push(product);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <View style={styles.carouselContainer}>
      {images.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(_, index) => `main-image-${index}`}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Ionicons name="image-outline" size={60} color="#ddd" />
          <Text style={styles.noImageText}>No image available</Text>
        </View>
      )}
      
      {/* Wishlist button */}
      <TouchableOpacity 
        style={styles.wishlistButton}
        onPress={toggleFavorite}
      >
        <View style={styles.wishlistIconContainer}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={22} 
            color={isFavorite ? "#FF3B5C" : "#fff"} 
          />
        </View>
      </TouchableOpacity>
      
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View 
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                activeImageIndex === index && styles.activePaginationDot,
              ]}
            />
          ))}
        </View>
      )}
      
      <View style={styles.farmingBadge}>
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badgeGradient}
        >
          <Ionicons name="leaf" size={16} color="#fff" />
          <Text style={styles.badgeText}>{product.farmingMethod || 'Organic'}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 20,
    width: width,
    height: width,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: width,
  },
  noImageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  noImageText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  farmingBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  wishlistButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  wishlistIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ImageCarousel;
