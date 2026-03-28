import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms } from '../utils/responsive';

import SummaryMetrics from './reporting/SummaryMetrics';
import SimpleSalesChart from './reporting/SimpleSalesChart';
import SimpleRevenueBreakdown from './reporting/SimpleRevenueBreakdown';
import TopProductsList from './reporting/TopProductsList';
import RecentOrders from './reporting/RecentOrders';
import UnifiedHeader from '../components/UnifiedHeader';
import { getFarmerAnalytics } from '../services/analyticsService';
import { addTestData, removeTestData, hasTestData } from '../services/testDataService';
import { useTranslation } from 'react-i18next';

const ReportingAnalytics = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [testDataExists, setTestDataExists] = useState(false);
  const [processingTestData, setProcessingTestData] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  
  // Check if in development mode
  const isDevelopmentMode = __DEV__;
  
  useEffect(() => {
    loadAnalyticsData();
  }, []);
  
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current farmer ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('ReportingAnalytics - Farmer ID from AsyncStorage:', userToken);
      
      if (!userToken) {
        console.error('Farmer not logged in');
        setError('Farmer not logged in');
        setLoading(false);
        return;
      }
      
      setFarmerId(userToken);
      
      // Fetch all analytics data
      const data = await getFarmerAnalytics(userToken);
      console.log('Analytics data loaded:', data);
      
      setAnalyticsData(data);
      
      // Check if test data exists
      if (isDevelopmentMode) {
        const testExists = await hasTestData(userToken);
        setTestDataExists(testExists);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestDataToggle = async () => {
    if (!farmerId) return;
    
    try {
      setProcessingTestData(true);
      
      if (testDataExists) {
        // Remove test data
        Alert.alert(
          'Remove Test Data',
          'Are you sure you want to remove all test data?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: async () => {
                const result = await removeTestData(farmerId);
                Alert.alert(
                  'Success',
                  `Removed ${result.ordersRemoved} orders and ${result.productsRemoved} products`
                );
                setTestDataExists(false);
                await loadAnalyticsData();
              },
            },
          ]
        );
      } else {
        // Add test data
        Alert.alert(
          'Add Test Data',
          'This will add sample orders and products for testing. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: async () => {
                const result = await addTestData(farmerId);
                Alert.alert(
                  'Success',
                  `Added ${result.ordersAdded} orders and ${result.productsAdded} products`
                );
                setTestDataExists(true);
                await loadAnalyticsData();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process test data');
    } finally {
      setProcessingTestData(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <UnifiedHeader
          title={t('farmer.report')}
          subtitle={t('farmer.reportSubtitle')}
          showCartButton={false}
          notificationCount={2}
          showMenuButton={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }
  
  if (error || !analyticsData) {
    return (
      <View style={styles.container}>
        <UnifiedHeader
          title={t('farmer.report')}
          subtitle={t('farmer.reportSubtitle')}
          showCartButton={false}
          notificationCount={2}
          showMenuButton={false}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No data available'}</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <UnifiedHeader
        title={t('farmer.report')}
        subtitle={t('farmer.reportSubtitle')}
        showCartButton={false}
        notificationCount={2}
        showMenuButton={false}
      />
      
      {/* Summary Cards - Revenue, Orders, Products, Growth */}
      <SummaryMetrics metrics={analyticsData.summaryMetrics} />
      
      {/* Sales Chart - Simplified visualization */}
      <SimpleSalesChart 
        salesData={analyticsData.salesData} 
      />
      
      {/* Revenue Breakdown - Simple visual representation */}
      <SimpleRevenueBreakdown revenueData={analyticsData.revenueBreakdown} />
      
      {/* Top Selling Products - List with visual indicators */}
      <TopProductsList products={analyticsData.topProducts} />
      
      {/* Recent Orders - Table of recent transactions */}
      <RecentOrders orders={analyticsData.recentOrders} />
      
      {/* Test Data Button - Only visible in development mode */}
      {isDevelopmentMode && (
        <View style={styles.testButtonContainer}>
          <TouchableOpacity
            style={[
              styles.testButton,
              testDataExists ? styles.testButtonRemove : styles.testButtonAdd,
              processingTestData && styles.testButtonDisabled
            ]}
            onPress={handleTestDataToggle}
            disabled={processingTestData}
          >
            <Ionicons 
              name={testDataExists ? "trash-outline" : "flask-outline"} 
              size={20} 
              color="white" 
              style={styles.testButtonIcon}
            />
            <Text style={styles.testButtonText}>
              {processingTestData
                ? 'Processing...'
                : testDataExists
                ? 'Remove Test Data'
                : 'Add Test Data'}
            </Text>
          </TouchableOpacity>
          {testDataExists && (
            <Text style={styles.testDataWarning}>⚠️ Test data is currently active</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: ms(22),
    fontWeight: 'bold',
    marginBottom: s(16),
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  loadingText: {
    marginTop: s(12),
    fontSize: ms(16),
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  errorText: {
    fontSize: ms(18),
    fontWeight: '600',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: s(8),
  },
  errorSubtext: {
    fontSize: ms(14),
    color: '#757575',
    textAlign: 'center',
  },
  testButtonContainer: {
    padding: s(16),
    marginTop: s(16),
    marginBottom: s(32),
    alignItems: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(14),
    paddingHorizontal: s(24),
    borderRadius: ms(12),
    minWidth: s(200),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonAdd: {
    backgroundColor: '#2196F3',
  },
  testButtonRemove: {
    backgroundColor: '#F44336',
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonIcon: {
    marginRight: s(8),
  },
  testButtonText: {
    color: 'white',
    fontSize: ms(16),
    fontWeight: '600',
  },
  testDataWarning: {
    marginTop: s(12),
    fontSize: ms(14),
    color: '#FF9800',
    fontWeight: '500',
  },
});

export default ReportingAnalytics;
