import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import theme from '../theme';

const FilterChips = ({ selected, onSelect, filters = ['All', 'Popular', 'New', 'On Sale'] }) => {
  const { t } = useTranslation();
  
  const getFilterTranslation = (filter) => {
    switch (filter) {
      case 'All': return t('filters.all');
      case 'Popular': return t('filters.popular');
      case 'New': return t('filters.new');
      case 'On Sale': return t('filters.onSale');
      default: return filter;
    }
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.chip,
            selected === filter && styles.selectedChip
          ]}
          onPress={() => onSelect(filter)}
        >
          <Text
            style={[
              styles.chipText,
              selected === filter && styles.selectedChipText
            ]}
          >
            {getFilterTranslation(filter)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.lightBackground,
    marginRight: 12,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FilterChips; 