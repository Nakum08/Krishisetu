import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const SimpleSalesChart = ({ salesData = [], weeklyData, yearlyData }) => {
  const { t } = useTranslation();
  const [timeFrame, setTimeFrame] = useState('month');
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    growth: 0,
    orders: 0
  });
  
  useEffect(() => {
    let data = [];
    let totalRev = 0;
    let totalOrders = 0;
    let growthValue = 0;
    
    switch(timeFrame) {
      case 'week':
        if (weeklyData && weeklyData.length > 0) {
          data = weeklyData;
        } else {
          data = salesData.slice(0, 6).map(item => ({
            label: item.month.substring(0, 1),
            revenue: item.revenue / 4,
            orders: Math.round((item.orders || 0) / 4)
          }));
        }
        growthValue = 8;
        break;
        
      case 'month':
        data = salesData.slice(0, 6).map(item => ({
          label: item.month,
          revenue: item.revenue,
          orders: item.orders || 0
        }));
        growthValue = 12;
        break;
        
      case 'year':
        if (yearlyData && yearlyData.length > 0) {
          data = yearlyData;
        } else {
          const quarterMap = {
            'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
            'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
            'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
            'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
          };
          
          const quarters = {};
          salesData.forEach(item => {
            const quarter = quarterMap[item.month] || 'Q1';
            if (!quarters[quarter]) {
              quarters[quarter] = { label: quarter, revenue: 0, orders: 0 };
            }
            quarters[quarter].revenue += item.revenue;
            quarters[quarter].orders += (item.orders || 0);
          });
          
          data = Object.values(quarters);
        }
        growthValue = 15;
        break;
    }
    
    totalRev = data.reduce((sum, item) => sum + item.revenue, 0);
    totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
    
    setFilteredData(data);
    setStats({
      totalRevenue: totalRev,
      growth: growthValue,
      orders: totalOrders
    });
  }, [timeFrame, salesData, weeklyData, yearlyData]);
  
  const maxRevenue = filteredData.length > 0 ? 
    Math.max(...filteredData.map(item => item.revenue)) : 1;
  
  const timeFrameOptions = [
    { id: 'week', label: t('farmer.weekly') },
    { id: 'month', label: t('farmer.monthly') },
    { id: 'year', label: t('farmer.yearly') },
  ];
  
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `₹${(value/1000000).toFixed(1)}M`;
    }
    return `₹${(value/1000).toFixed(1)}k`;
  };
  
  const hasData = salesData && salesData.length > 0 && salesData.some(item => item.revenue > 0);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('farmer.salesPerformance')}</Text>
        
        {hasData && (
          <View style={styles.timeFrameSelector}>
            {timeFrameOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.timeFrameOption,
                  timeFrame === option.id && styles.activeTimeFrame
                ]}
                onPress={() => setTimeFrame(option.id)}
              >
                <Text 
                  style={[
                    styles.timeFrameText,
                    timeFrame === option.id && styles.activeTimeFrameText
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {!hasData ? (
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No sales data yet</Text>
          <Text style={styles.emptySubtext}>Sales will appear here once you have orders</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            {filteredData.map((item, index) => (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { width: `${(item.revenue / maxRevenue) * 100}%` }
                    ]} 
                  />
                  <Text style={styles.barValue}>{formatCurrency(item.revenue)}</Text>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statLabel}>{t('farmer.revenue')}</Text>
              <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.statLabel}>{t('farmer.growth')}</Text>
              <Text style={styles.statValue}>+{stats.growth}%</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="basket" size={16} color="#FF9800" />
              <Text style={styles.statLabel}>{t('farmer.orders')}</Text>
              <Text style={styles.statValue}>{stats.orders}</Text>
            </View>
          </View>
        </>
      )}
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
  header: {
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
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 3,
  },
  timeFrameOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeTimeFrame: {
    backgroundColor: '#4CAF50',
  },
  timeFrameText: {
    fontSize: 12,
    color: '#757575',
  },
  activeTimeFrameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 16,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabelContainer: {
    width: 40,
  },
  barLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
    height: 25,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  barValue: {
    position: 'absolute',
    right: 8,
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SimpleSalesChart;