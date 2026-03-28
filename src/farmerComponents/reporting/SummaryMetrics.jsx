import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { s, ms, wp } from '../../utils/responsive.js';

const MetricCard = ({ title, value, subtitle, iconName, color }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardIcon}>
        <Ionicons name={iconName} size={24} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const SummaryMetrics = ({ metrics }) => {
  const { t } = useTranslation();
  const defaultMetrics = {
    revenue: { value: '₹42,500', change: '+12%', timeFrame: t('farmer.vsLastMonth') },
    orders: { value: '48', change: '+8%', timeFrame: t('farmer.vsLastMonth') },
    products: { value: '12', change: '0%', timeFrame: t('farmer.vsLastMonth') },
    customers: { value: '32', change: '+15%', timeFrame: t('farmer.vsLastMonth') },
  };
  
  const data = metrics || defaultMetrics;
  
  return (
    <View style={styles.container}>
      <MetricCard
        title={t('farmer.totalRevenue')}
        value={data.revenue.value}
        subtitle={`${data.revenue.change} ${data.revenue.timeFrame}`}
        iconName="cash-outline"
        color="#4CAF50"
      />
      
      <MetricCard
        title={t('farmer.totalOrders')}
        value={data.orders.value}
        subtitle={`${data.orders.change} ${data.orders.timeFrame}`}
        iconName="cart-outline"
        color="#2196F3"
      />
      
      <MetricCard
        title={t('farmer.activeProducts')}
        value={data.products.value}
        subtitle={`${data.products.change} ${data.products.timeFrame}`}
        iconName="leaf-outline"
        color="#FF9800"
      />
      
      <MetricCard
        title={t('farmer.newCustomers')}
        value={data.customers.value}
        subtitle={`${data.customers.change} ${data.customers.timeFrame}`}
        iconName="people-outline"
        color="#9C27B0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: s(16),
    paddingHorizontal: s(2),
  },
  card: {
    width: wp(47),
    backgroundColor: 'white',
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: s(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardIcon: {
    marginBottom: s(12),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: ms(14),
    color: '#757575',
    marginBottom: s(4),
  },
  cardValue: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: s(4),
  },
  cardSubtitle: {
    fontSize: ms(12),
    color: '#4CAF50',
  },
});

export default SummaryMetrics; 