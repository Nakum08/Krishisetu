import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InventoryStatus = ({ inventory }) => {
  const defaultInventory = [
    { id: '1', name: 'Wheat', stock: 350, unit: 'kg', status: 'in_stock' },
    { id: '2', name: 'Rice', stock: 280, unit: 'kg', status: 'in_stock' },
    { id: '3', name: 'Potato', stock: 120, unit: 'kg', status: 'low_stock' },
    { id: '4', name: 'Tomato', stock: 85, unit: 'kg', status: 'low_stock' },
    { id: '5', name: 'Onion', stock: 0, unit: 'kg', status: 'out_of_stock' },
  ];
  
  const data = inventory || defaultInventory;
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'in_stock': return '#4CAF50';
      case 'low_stock': return '#FF9800';
      case 'out_of_stock': return '#F44336';
      default: return '#757575';
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Inventory Status</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 2 }]}>Product</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Stock</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Status</Text>
      </View>
      
      {data.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={[styles.productName, { flex: 2 }]}>{item.name}</Text>
          <Text style={[styles.stockValue, { flex: 1 }]}>
            {item.stock} {item.unit}
          </Text>
          <View style={[styles.statusContainer, { flex: 1.5 }]}>
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor(item.status) }
              ]} 
            />
            <Text 
              style={[
                styles.statusText, 
                { color: getStatusColor(item.status) }
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.updateButton}>
        <Ionicons name="refresh-outline" size={16} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Update Inventory</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productName: {
    fontSize: 14,
    color: '#333',
  },
  stockValue: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default InventoryStatus;