import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms, wp, hp } from '../../utils/responsive.js';

// Column Chart Component
const ColumnChart = ({ products }) => {
  const maxSold = Math.max(...products.map(item => item.sold));
  const chartHeight = hp(22);
  const chartWidth = wp(85);
  const barWidth = s(50);
  const spacing = s(10);
  const paddingBottom = s(40);
  const paddingTop = s(20);
  
  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
  
  return (
    <View style={styles.chartWrapper}>
      <Svg width={chartWidth} height={chartHeight + paddingBottom}>
        {/* Horizontal grid lines */}
        <Line x1="0" y1={paddingTop} x2={chartWidth} y2={paddingTop} stroke="#E0E0E0" strokeWidth="1" />
        <Line x1="0" y1={chartHeight / 2 + paddingTop} x2={chartWidth} y2={chartHeight / 2 + paddingTop} stroke="#F0F0F0" strokeWidth="1" />
        <Line x1="0" y1={chartHeight + paddingTop} x2={chartWidth} y2={chartHeight + paddingTop} stroke="#E0E0E0" strokeWidth="1" />
        
        {/* Bars */}
        {products.map((product, index) => {
          const barHeight = (product.sold / maxSold) * chartHeight;
          const x = index * (barWidth + spacing) + spacing;
          const y = chartHeight - barHeight + paddingTop;
          
          return (
            <React.Fragment key={index}>
              {/* Bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={colors[index % colors.length]}
                rx={4}
                ry={4}
              />
              
              {/* Value on top of bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 8}
                fill="#333"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {product.sold}
              </SvgText>
              
              {/* Product name below bar */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + paddingTop + 20}
                fill="#757575"
                fontSize="11"
                textAnchor="middle"
              >
                {product.name.length > 8 ? product.name.substring(0, 8) + '...' : product.name}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const TopProductsList = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Top Selling Products</Text>
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No products sold yet</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Top Selling Products</Text>
        <View style={styles.badge}>
          <Ionicons name="trophy" size={16} color="#FFD700" />
          <Text style={styles.badgeText}>Top {products.length}</Text>
        </View>
      </View>
      
      {/* Column Chart */}
      <ColumnChart products={products} />
      
      {/* Details List */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsHeaderText}>Details</Text>
        </View>
        {products.map((product, index) => (
          <View key={index} style={styles.detailRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="cube-outline" size={14} color="#757575" />
                  <Text style={styles.statText}>{product.sold} kg</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="cash-outline" size={14} color="#4CAF50" />
                  <Text style={styles.revenueText}>₹{product.revenue.toLocaleString()}</Text>
                </View>
              </View>
            </View>
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: ms(12),
  },
  badgeText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: s(4),
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: s(16),
    paddingHorizontal: s(4),
  },
  detailsContainer: {
    marginTop: s(16),
  },
  detailsHeader: {
    paddingBottom: s(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: s(12),
  },
  detailsHeaderText: {
    fontSize: ms(14),
    fontWeight: '600',
    color: '#757575',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rankBadge: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  rankText: {
    fontSize: ms(14),
    fontWeight: 'bold',
    color: '#757575',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: ms(15),
    fontWeight: '600',
    color: '#333',
    marginBottom: s(6),
  },
  statsRow: {
    flexDirection: 'row',
    gap: s(16),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  statText: {
    fontSize: ms(13),
    color: '#757575',
  },
  revenueText: {
    fontSize: ms(13),
    fontWeight: '600',
    color: '#4CAF50',
  },
  emptyState: {
    padding: s(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: ms(14),
    color: '#757575',
    marginTop: s(12),
  },
});

export default TopProductsList; 