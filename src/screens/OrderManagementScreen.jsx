import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderManagement from '../farmerComponents/OrderManagement';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const OrderManagementScreen = () => {
  return (
    <View style={styles.container}>
      <OrderManagement />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrderManagementScreen;
