import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const RevenueBreakdown = ({ revenueData }) => {
  const defaultData = [
    {
      name: 'Wheat',
      revenue: 21250,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Rice',
      revenue: 19500,
      color: '#2196F3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Potato',
      revenue: 11250,
      color: '#FF9800',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Other Crops',
      revenue: 15900,
      color: '#9C27B0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];
  
  const data = revenueData || defaultData;
  
  const chartData = data.map(item => ({
    name: item.name,
    population: item.revenue,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: item.legendFontSize,
  }));
  
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Revenue Breakdown</Text>
        <Text style={styles.totalRevenue}>₹{totalRevenue.toLocaleString()}</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={180}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
          center={[Dimensions.get("window").width / 6, 0]}
        />
        
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendName}>{item.name}</Text>
              <Text style={styles.legendValue}>₹{item.revenue.toLocaleString()}</Text>
              <Text style={styles.legendPercent}>
                {((item.revenue / totalRevenue) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
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
  totalRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legendContainer: {
    marginLeft: 16,
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendName: {
    fontSize: 12,
    color: '#333',
    width: 70,
    marginRight: 4,
  },
  legendValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 4,
  },
  legendPercent: {
    fontSize: 12,
    color: '#757575',
  },
});

export default RevenueBreakdown;