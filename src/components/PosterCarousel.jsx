import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 48;

const PosterCarousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      if (flatListRef.current && data.length > 0) {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current.scrollToOffset({
          offset: nextIndex * (ITEM_WIDTH + 16),
          animated: true
        });
        setActiveIndex(nextIndex);
      }
    }, 1500);
    
    return () => clearInterval(autoScrollInterval);
  }, [activeIndex, data.length]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  const renderDot = (index) => {
    return (
      <View
        key={index}
        style={[
          styles.dot,
          activeIndex === index && styles.activeDot
        ]}
      />
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textOverlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onScroll={handleScroll}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: s(16),
  },
  listContent: {
    paddingHorizontal: s(24),
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: s(180),
    marginRight: s(16),
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: s(16),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: s(4),
  },
  subtitle: {
    fontSize: ms(14),
    color: '#FFFFFF',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(12),
  },
  dot: {
    width: s(8),
    height: s(8),
    borderRadius: ms(4),
    backgroundColor: '#CCCCCC',
    marginHorizontal: s(4),
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: s(12),
    height: s(12),
    borderRadius: ms(6),
  },
});

export default PosterCarousel;