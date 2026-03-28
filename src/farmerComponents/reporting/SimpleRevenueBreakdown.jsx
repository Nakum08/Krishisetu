import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { s, ms, wp } from '../../utils/responsive.js';

// Pie Chart Component
const PieChart = ({ data, size = wp(55) }) => {
  const center = size / 2;
  const radius = size / 2 - s(10);
  
  let currentAngle = -Math.PI / 2; // Start from top
  
  const createPieSlice = (percentage, color, index) => {
    const angle = (percentage / 100) * 2 * Math.PI;
    const endAngle = currentAngle + angle;
    
    const x1 = center + radius * Math.cos(currentAngle);
    const y1 = center + radius * Math.sin(currentAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Calculate label position (middle of the slice)
    const labelAngle = currentAngle + angle / 2;
    const labelRadius = radius * 0.65;
    const labelX = center + labelRadius * Math.cos(labelAngle);
    const labelY = center + labelRadius * Math.sin(labelAngle);
    
    currentAngle = endAngle;
    
    return (
      <G key={index}>
        <Path d={pathData} fill={color} />
        {percentage >= 8 && (
          <SvgText
            x={labelX}
            y={labelY}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {percentage}%
          </SvgText>
        )}
      </G>
    );
  };
  
  return (
    <Svg width={size} height={size}>
      {data.map((item, index) => createPieSlice(item.percentage, item.color, index))}
      {/* Center circle for donut effect */}
      <Circle cx={center} cy={center} r={radius * 0.4} fill="white" />
      <SvgText
        x={center}
        y={center - 8}
        fill="#333"
        fontSize="12"
        fontWeight="600"
        textAnchor="middle"
      >
        Total
      </SvgText>
      <SvgText
        x={center}
        y={center + 10}
        fill="#4CAF50"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
      >
        100%
      </SvgText>
    </Svg>
  );
};

const SimpleRevenueBreakdown = ({ revenueData = [] }) => {
  const { t } = useTranslation();
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  if (!revenueData || revenueData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('farmer.revenueBreakdown')}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No revenue data available</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('farmer.revenueBreakdown')}</Text>
        <Text style={styles.totalRevenue}>₹{totalRevenue.toLocaleString()}</Text>
      </View>
      
      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart data={revenueData} size={wp(58)} />
      </View>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {revenueData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.legendValue}>₹{item.revenue.toLocaleString()}</Text>
            <Text style={styles.legendPercent}>
              {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: s(16),
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
    marginBottom: s(16),
  },
  title: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#333',
  },
  totalRevenue: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(20),
  },
  legendContainer: {
    marginTop: s(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(12),
  },
  legendColor: {
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    marginRight: s(8),
  },
  legendName: {
    fontSize: ms(14),
    color: '#333',
    width: wp(25),
    marginRight: s(16),
  },
  legendValue: {
    fontSize: ms(14),
    color: '#333',
    fontWeight: 'bold',
    marginRight: s(16),
    width: wp(20),
  },
  legendPercent: {
    fontSize: ms(14),
    color: '#757575',
  },
  emptyState: {
    padding: s(20),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: ms(14),
    color: '#757575',
  },
});

export default SimpleRevenueBreakdown; 