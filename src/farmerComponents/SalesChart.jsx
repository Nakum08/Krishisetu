import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SalesChart = ({ salesData, timeFrame, onTimeFrameChange }) => {
  const defaultData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => `rgba(76, 175, 80, 1)`,
        strokeWidth: 2
      }
    ],
  };
  
  const data = salesData || defaultData;
  
  const timeFrameOptions = [
    { id: 'week', label: 'Weekly' },
    { id: 'month', label: 'Monthly' },
    { id: 'year', label: 'Yearly' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales Performance</Text>
        
        <View style={styles.timeFrameSelector}>
          {timeFrameOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.timeFrameOption,
                timeFrame === option.id && styles.activeTimeFrame
              ]}
              onPress={() => onTimeFrameChange(option.id)}
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
      </View>
      
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="₹"
        yAxisSuffix="k"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#4CAF50"
          }
        }}
        bezier
        style={styles.chart}
      />
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValue}>₹42.5k</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.statLabel}>Growth</Text>
          <Text style={styles.statValue}>+12%</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="basket" size={16} color="#FF9800" />
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>48</Text>
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
});

export default SalesChart;
