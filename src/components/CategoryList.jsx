import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const { width } = Dimensions.get('window');
const itemWidth = (width - theme.spacing.md * 2 - theme.spacing.sm * 2) / 3;

const CategoryList = ({ categories, onCategoryPress }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onCategoryPress(item)}>
      <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  card: {
    width: itemWidth,
    alignItems: 'center',
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(1) },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: itemWidth - theme.spacing.sm * 2,
    height: itemWidth - theme.spacing.sm * 2,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: ms(14),
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});

export default CategoryList;
