import React from 'react';
import { ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import theme from '../theme';

const ThumbnailList = ({ images = [], activeImage, onThumbnailPress }) => {
  if (!images || images.length === 0) return null;
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {images.slice(0, 4).map((img, index) => (
        <TouchableOpacity key={index} onPress={() => onThumbnailPress(img)}>
          <Image
            source={{ uri: img }}
            style={[styles.thumbnail, activeImage === img && styles.activeThumbnail]}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeThumbnail: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
});

export default ThumbnailList;
