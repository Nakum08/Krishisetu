import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7; 
const cardHeight = 150;

const AttractiveCategoryList = ({ categories, onCategoryPress }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCategoryPress(item)}>
      <ImageBackground source={{ uri: item.imageUri }} style={styles.image} imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.textOverlay}
        >
          <Text style={styles.title}>{item.name}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      snapToInterval={cardWidth + theme.spacing.sm}
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: theme.borderRadius.md,
  },
  gradient: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AttractiveCategoryList;
