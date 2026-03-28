import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const TopSellingProducts = ({ products }) => {
  const defaultProducts = [
    { name: 'Wheat', sold: 85, revenue: 21250 },
    { name: 'Rice', sold: 65, revenue: 19500 },
    { name: 'Potato', sold: 45, revenue: 11250 },
    { name: 'Tomato', sold: 28, revenue: 8400 },
    { name: 'Onion', sold: 25, revenue: 7500 },
  ];
  
  const data = products || defaultProducts;
  
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.sold),
      }
    ]
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Selling Products</Text>
      
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.7,
        }}
        style={styles.chart}
        showValuesOnTopOfBars={true}
      />
      
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Product</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Sold</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Revenue</Text>
      </View>
      
      {data.map((product, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{product.name}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{product.sold} kg</Text>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>₹{product.revenue.toLocaleString()}</Text>
        </View>
      ))}
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 16,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
});

export default TopSellingProducts;