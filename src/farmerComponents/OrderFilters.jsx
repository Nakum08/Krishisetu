import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const OrderFilters = ({ activeFilter, setActiveFilter }) => {
  const { t } = useTranslation();
  
  const filters = [
    { id: 'all', label: t('farmer.allOrders'), icon: 'list' },
    { id: 'pending', label: t('farmer.pending'), icon: 'time' },
    { id: 'processing', label: t('farmer.processing'), icon: 'construct' },
    { id: 'shipped', label: t('farmer.shipped'), icon: 'car' },
    { id: 'delivered', label: t('farmer.delivered'), icon: 'checkmark-done-circle' },
  ];
  
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.activeFilterButton
          ]}
          onPress={() => setActiveFilter(filter.id)}
        >
          <Ionicons 
            name={`${filter.icon}${activeFilter === filter.id ? '' : '-outline'}`}
            size={16}
            color={activeFilter === filter.id ? '#FFFFFF' : '#4CAF50'}
            style={styles.filterIcon}
          />
          <Text 
            style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  contentContainer: {
    paddingRight: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4CAF50',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
});

export default OrderFilters; 