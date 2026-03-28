import React from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ImageThumbnails = ({ images, activeImageIndex, handleImageChange }) => (
  <>
    {images.length > 1 && (
      <View style={styles.thumbnailsWrapper}>
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsContainer}
          keyExtractor={(_, index) => `thumbnail-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.thumbnailWrapper,
                activeImageIndex === index && styles.activeThumbnailWrapper,
              ]}
              onPress={() => handleImageChange(index)}
            >
              <Image
                source={{ uri: item }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  thumbnailsWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: -12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailsContainer: {
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeThumbnailWrapper: {
    borderColor: '#ff6b6b',
    transform: [{ scale: 1.025 }],
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default ImageThumbnails;