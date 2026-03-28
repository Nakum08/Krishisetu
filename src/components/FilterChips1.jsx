import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const FilterChips1 = ({ filterOptions, selectedFilter, onSelectFilter }) => {
  const { t } = useTranslation();
  
  const getFilterTranslation = (option) => {
    switch (option) {
      case 'All': return t('filters.all');
      case 'Popular': return t('filters.popular');
      case 'New': return t('filters.new');
      case 'On Sale': return t('filters.onSale');
      default: return option;
    }
  };
  
  return (
    <View style={styles.container}>
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.chip,
            selectedFilter === option && styles.activeChip,
          ]}
          onPress={() => onSelectFilter(option)}
        >
          <Text style={[
            styles.chipText,
            selectedFilter === option && styles.activeChipText,
          ]}>
            {getFilterTranslation(option)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  activeChip: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  activeChipText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterChips1;
