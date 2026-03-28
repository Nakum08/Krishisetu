import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BulkOrderModal = ({
  showBulkOrderModal,
  setShowBulkOrderModal,
  product,
  bulkQuantity,
  setBulkQuantity,
  getBulkPrice,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showBulkOrderModal}
    onRequestClose={() => setShowBulkOrderModal(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Bulk Order</Text>
          <TouchableOpacity onPress={() => setShowBulkOrderModal(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.bulkInfoText}>
          Minimum quantity: {product.bulkMinimumQuantity || 10}kg
        </Text>
        <Text style={styles.bulkInfoText}>
          Discount: {product.bulkDiscountPercentage || 8}% off regular price
        </Text>
        
        <View style={styles.bulkQuantityContainer}>
          <Text style={styles.bulkQuantityLabel}>Quantity (kg):</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setBulkQuantity(Math.max(product.bulkMinimumQuantity || 10, bulkQuantity - 5))}
            >
              <Ionicons name="remove" size={18} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{bulkQuantity} kg</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setBulkQuantity(bulkQuantity + 5)}
            >
              <Ionicons name="add" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.bulkPriceContainer}>
          <Text style={styles.bulkPriceLabel}>Total Price:</Text>
          <Text style={styles.bulkPriceValue}>
            ₹{getBulkPrice()} 
            <Text style={styles.bulkSavingsText}>
              {" "}(Save ₹{(product.pricePerKg * bulkQuantity - getBulkPrice()).toFixed(2)})
            </Text>
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.confirmBulkButton}
          onPress={() => {
            setShowBulkOrderModal(false);
          }}
        >
          <Text style={styles.confirmBulkButtonText}>Confirm Bulk Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bulkInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bulkQuantityContainer: {
    marginVertical: 16,
  },
  bulkQuantityLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 12,
  },
  bulkPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  bulkPriceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  bulkPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bulkSavingsText: {
    fontSize: 14,
    color: '#888',
  },
  confirmBulkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmBulkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BulkOrderModal;
