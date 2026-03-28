import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const EmptyOrderState = ({ filterType }) => {
  const { t } = useTranslation();
  
  const getMessage = () => {
    switch(filterType) {
      case 'pending':
        return t('farmer.noPendingOrders');
      case 'processing':
        return t('farmer.noProcessingOrders');
      case 'shipped':
        return t('farmer.noShippedOrders');
      case 'delivered':
        return t('farmer.noDeliveredOrders');
      default:
        return t('farmer.noOrdersFound');
    }
  };
  
  const getSubMessage = () => {
    switch(filterType) {
      case 'pending':
        return t('farmer.pendingOrdersMessage');
      case 'processing':
        return t('farmer.processingOrdersMessage');
      case 'shipped':
        return t('farmer.shippedOrdersMessage');
      case 'delivered':
        return t('farmer.deliveredOrdersMessage');
      default:
        return t('farmer.defaultOrdersMessage');
    }
  };
  
  const getIcon = () => {
    switch(filterType) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'construct-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-done-circle-outline';
      default:
        return 'basket-outline';
    }
  };
  
  return (
    <View style={styles.container}>
      <Ionicons name={getIcon()} size={60} color="#CCCCCC" />
      <Text style={styles.message}>{getMessage()}</Text>
      <Text style={styles.subMessage}>{getSubMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
    marginTop: 15,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  }
});

export default EmptyOrderState; 