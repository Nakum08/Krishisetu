import React from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ThumbnailList = ({ images, activeImageIndex, onThumbnailPress }) => {
  return (
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
          onPress={() => onThumbnailPress(index)}
        >
          <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="cover" />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  thumbnailsContainer: {
    padding: 15,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  activeThumbnailWrapper: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default ThumbnailList;
