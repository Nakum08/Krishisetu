import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import theme from '../theme';

const { width } = Dimensions.get('window');

const PosterCarousel = ({ posters, autoScrollInterval = 3000 }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const carouselWidth = width - 2 * theme.spacing.md;
  const imageWidth = carouselWidth;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % posters.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * imageWidth, animated: true });
    }, autoScrollInterval);
    
    return () => clearInterval(timer);
  }, [currentIndex, posters.length, autoScrollInterval, imageWidth]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.floor(e.nativeEvent.contentOffset.x / imageWidth);
          setCurrentIndex(newIndex);
        }}
      >
        {posters.map((poster, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: poster }}
              style={[styles.posterImage, { width: imageWidth }]}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {posters.map((_, index) => (
          <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160, 
    marginTop: theme.spacing.md, 
    marginHorizontal: theme.spacing.md, 
    marginBottom: theme.spacing.lg,
    borderRadius: 12, 
    overflow: 'hidden', 
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  posterImage: {
    height: 160, 
    borderRadius: 12,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
  },
});

export default PosterCarousel;