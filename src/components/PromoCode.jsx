import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PromoCode = ({ promoCode, setPromoCode, promoApplied, applyPromoCode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Promo Code</Text>
      
      <View style={styles.promoContainer}>
        <View style={[styles.inputWrapper, promoApplied && styles.inputWrapperSuccess]}>
          <Ionicons 
            name="pricetag-outline" 
            size={18} 
            color={promoApplied ? "#4CAF50" : "#999"} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Promo Code"
            value={promoCode}
            onChangeText={setPromoCode}
            editable={!promoApplied}
          />
          {promoApplied && (
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={styles.successIcon} />
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.applyButton,
            promoApplied ? styles.removeButton : styles.applyButton
          ]}
          onPress={applyPromoCode}
        >
          <Text style={styles.applyButtonText}>
            {promoApplied ? 'Change' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {promoApplied && (
        <View style={styles.promoAppliedContainer}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
          <Text style={styles.promoAppliedText}>
            Promo code applied successfully!
          </Text>
        </View>
      )}
      
      {/* Sample promo codes for the user */}
      <View style={styles.availablePromos}>
        <Text style={styles.availablePromosTitle}>Available Promo Codes:</Text>
        <View style={styles.promoItem}>
          <Text style={styles.promoCode}>FRESH20</Text>
          <Text style={styles.promoDescription}>20% off on your first order</Text>
        </View>
        <View style={styles.promoItem}>
          <Text style={styles.promoCode}>FARM10</Text>
          <Text style={styles.promoDescription}>10% off on all orders</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    marginRight: 12,
  },
  inputWrapperSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  successIcon: {
    marginLeft: 8,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF9800',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  promoAppliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  promoAppliedText: {
    fontSize: 13,
    color: '#4CAF50',
    marginLeft: 4,
  },
  availablePromos: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  availablePromosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  promoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  promoCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
    marginRight: 8,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoDescription: {
    fontSize: 13,
    color: '#666',
  },
});

export default PromoCode;
