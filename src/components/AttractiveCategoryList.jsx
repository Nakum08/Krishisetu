import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const CategoryCard = ({ category, onPress }) => (
  <TouchableOpacity
    style={styles.categoryCard}
    onPress={() => onPress(category)}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: category.imageUri }}
      style={styles.categoryImage}
      resizeMode="cover"
    />
    <View style={styles.categoryTextContainer}>
      <Text style={styles.categoryName}>{category.name}</Text>
    </View>
  </TouchableOpacity>
);

const AttractiveCategoryList = ({ categories, onCategoryPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onPress={onCategoryPress}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: s(8),
    paddingLeft: s(4),
  },
  categoryCard: {
    width: s(110),
    height: s(110),
    marginRight: s(12),
    borderRadius: ms(12),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: '70%',
  },
  categoryTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  categoryName: {
    fontSize: ms(14),
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default AttractiveCategoryList; 