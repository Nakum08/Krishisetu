import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme/theme';

const OrderFilter = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: 'All', label: 'All Orders', icon: 'list' },
    { id: 'Processing', label: 'Processing', icon: 'time-outline' },
    { id: 'Shipped', label: 'Shipped', icon: 'car-outline' },
    { id: 'Delivered', label: 'Delivered', icon: 'checkmark-circle-outline' },
    { id: 'Cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
  ];
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.selectedFilterButton,
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Ionicons 
              name={filter.icon} 
              size={16} 
              color={selectedFilter === filter.id ? '#FFFFFF' : theme.colors.text} 
            />
            <Text 
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.selectedFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: theme.colors.lightBackground,
  },
  selectedFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginLeft: 8,
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
});

export default OrderFilter; 