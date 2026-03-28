import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme/theme';
import { getOrdersByUser } from '../services/firestoreSeedOrders';
import UnifiedHeader from '../components/UnifiedHeader';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const CustomerOrdersScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  useEffect(() => {
    fetchOrders();
    
    const refreshInterval = setInterval(() => {
      if (!refreshing) {
        onSilentRefresh();
      }
    }, 30000); 
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get current user ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('CustomerOrders - User token from AsyncStorage:', userToken);
      
      if (!userToken) {
        console.log('No user token found, cannot fetch orders');
        setOrders([]);
        setFilteredOrders([]);
        return;
      }
      
      const ordersData = await getOrdersByUser(userToken);
      console.log(`Found ${ordersData.length} orders for user ${userToken}`);
      
      const sortedOrders = [...ordersData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const onSilentRefresh = async () => {
    try {
      // Get current user ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        console.log('No user token found during silent refresh');
        return;
      }
      
      const ordersData = await getOrdersByUser(userToken);
      
      const sortedOrders = [...ordersData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });
      
      setOrders(sortedOrders);
      
      if (selectedFilter === 'All') {
        setFilteredOrders(sortedOrders);
      } else {
        const filtered = sortedOrders.filter(order => 
          order.status === selectedFilter || 
          (selectedFilter === 'Processing' && order.status === 'confirmed')
        );
        setFilteredOrders(filtered);
      }
    } catch (error) {
      console.error("Error silently refreshing orders:", error);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };
  
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    
    if (filter === 'All') {
      setFilteredOrders(orders);
      return;
    }
    
    const filtered = orders.filter(order => {
      if (order.product && order.product.category === filter) {
        return true;
      }
      
      if (order.products && order.products.length > 0) {
        return order.products.some(product => {
          const productCategory = 
            product.category || 
            product.product?.category ||
            (product.productId && orders.find(p => 
              p.id === product.productId || p.docId === product.productId)?.category);
          
          return productCategory === filter;
        });
      }
      
      return false;
    });
    
    setFilteredOrders(filtered);
  };
  
  const navigateToOrderDetails = (order) => {
    try {
      navigation.navigate('OrderConfirmationScreen', { order });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  
  const OrderCard = ({ order, onPress }) => {
    const formatDate = (dateString) => {
      try {
        if (!dateString) return 'Unknown date';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      } catch (error) {
        return 'Unknown date';
      }
    };
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'Processing': return '#FF9800';
        case 'Shipped': return '#2196F3';
        case 'Delivered': return '#4CAF50';
        case 'Cancelled': return '#F44336';
        case 'confirmed': return '#FF9800';
        default: return '#757575';
      }
    };
    
    const getPaymentMethodIcon = (method) => {
      switch (method) {
        case 'cod': return 'cash-outline';
        case 'upi': return 'wallet-outline';
        case 'card': return 'card-outline';
        default: return 'wallet-outline';
      }
    };
    
    const getPaymentMethodName = (method) => {
      switch (method) {
        case 'cod': return 'Cash on Delivery';
        case 'upi': return 'UPI';
        case 'card': return 'Card';
        default: return method ? method.toUpperCase() : 'Payment';
      }
    };
    
    const totalQuantity = order.quantity || 
                         order.products?.reduce((total, item) => 
                           total + (parseInt(item.quantity) || 0), 0) || 0;
    
    const productName = order.product?.crop || 
                       (order.products && order.products.length > 0 ? 
                         order.products[0]?.productId || t('orders.multipleProducts') : 
                         t('orders.unknownProduct'));
    
    const placeholderImage = 'https://via.placeholder.com/100?text=No+Image';
    const productImage = order.product?.images?.[0] || placeholderImage;
    
    const isMultiProduct = order.products && order.products.length > 1;
    
    const getProductCategory = (order) => {
      return order.product?.category || 
             order.products?.[0]?.category ||
             order.products?.[0]?.product?.category || 
             'uncategorized';
    };
    
    const getCategoryIcon = (category) => {
      switch (category) {
        case 'vegetables': return 'leaf-outline';
        case 'fruits': return 'nutrition-outline';
        case 'grains': return 'basket-outline';
        case 'nuts': return 'restaurant-outline';
        case 'legumes': return 'egg-outline';
        case 'spices': return 'flame-outline';
        case 'honey': return 'water-outline';
        default: return 'ellipse-outline';
      }
    };
    
    const getCategoryColor = (category) => {
      switch (category) {
        case 'vegetables': return '#4CAF50';
        case 'fruits': return '#FF9800';
        case 'grains': return '#FFC107';
        case 'nuts': return '#795548';
        case 'legumes': return '#8BC34A';
        case 'spices': return '#F44336';
        case 'honey': return '#FFB300';
        default: return '#9E9E9E';
      }
    };
    
    const productCategory = getProductCategory(order);
    const categoryIcon = getCategoryIcon(productCategory);
    const categoryColor = getCategoryColor(productCategory);
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress} 
        activeOpacity={0.8}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{t('orders.orderNumber')}{order.id || 'ORD'}</Text>
            <Text style={styles.orderDate}>
              {formatDate(order.createdAt || order.updatedAt)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <Text style={styles.statusText}>{order.status || 'Processing'}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* Order Content */}
        <View style={styles.orderContent}>
          {/* Left: Product Image */}
          <Image 
            source={{ uri: productImage }} 
            style={styles.productImage}
          />
          
          {/* Middle: Order Details */}
          <View style={styles.orderDetails}>
            <View style={styles.categoryRow}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                <Ionicons name={categoryIcon} size={12} color={categoryColor} />
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.productNameText} numberOfLines={1}>
              {productName}
              {isMultiProduct ? ` + ${order.products.length - 1} more` : ''}
            </Text>
            
            <Text style={styles.orderItemsText}>
              {totalQuantity} kg
            </Text>
          </View>
          
          {/* Right: Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.totalPrice}>₹{order.total || order.subtotal || 0}</Text>
            <View style={styles.paymentMethodBadge}>
              <Ionicons 
                name={getPaymentMethodIcon(order.paymentMethod)} 
                size={12} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles.paymentMethodText}>
                {getPaymentMethodName(order.paymentMethod)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Order Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.addressText} numberOfLines={1}>
              {order.shippingInfo ? 
                `${order.shippingInfo.city || ''}, ${order.shippingInfo.pincode || ''}` : 
                'Address unavailable'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  const OrderFilter = ({ selectedFilter, onFilterChange }) => {
    const categoryFilters = [
      { id: 'All', label: t('orders.allOrders') },
      { id: 'vegetables', label: t('categories.vegetables') },
      { id: 'fruits', label: t('categories.fruits') },
      { id: 'grains', label: t('categories.grains') },
      { id: 'nuts', label: t('categories.nuts') },
      { id: 'legumes', label: t('categories.legumes') },
      { id: 'spices', label: t('categories.spices') },
      { id: 'honey', label: t('categories.honey') },
    ];
    
  return (
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {categoryFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.selectedFilterButton
              ]}
              onPress={() => onFilterChange(filter.id)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.id && styles.selectedFilterText
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="receipt-outline" 
        size={80} 
        color="#E0E0E0" 
      />
      <Text style={styles.emptyTitle}>{t('orders.noOrdersFound')}</Text>
      <Text style={styles.emptyText}>
        {t('orders.noOrdersPlacedYet')}
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.emptyButtonText}>{t('orders.browseProducts')}</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View> */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('orders.loadingOrders')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => navigation.navigate('MessagingScreen')}
        > */}
          {/* <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={24} 
            color={theme.colors.primary} 
          /> */}
        {/* </TouchableOpacity>
      </View> */}

<UnifiedHeader 
        title={t('orders.myOrders')}
        // showMenuButton
        onMenuPress={() => navigation.openDrawer()} // Assuming you have a drawer navigator
      />
      
      <OrderFilter 
        selectedFilter={selectedFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      {filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id || item.docId || Math.random().toString()}
          renderItem={({ item }) => (
            <OrderCard 
              order={item} 
              onPress={() => navigateToOrderDetails(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: s(12),
    fontSize: ms(16),
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: ms(22),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  supportButton: {
    width: s(40),
    height: s(40),
    borderRadius: ms(20),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: s(16),
  },
  filterContainer: {
    paddingVertical: s(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScrollContent: {
    paddingHorizontal: s(16),
    paddingVertical: s(8),
  },
  filterButton: {
    paddingHorizontal: s(14),
    paddingVertical: s(8),
    borderRadius: ms(20),
    backgroundColor: '#F5F5F5',
    marginRight: s(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(1) },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: ms(14),
    fontWeight: '500',
    color: theme.colors.text,
  },
  selectedFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    padding: s(16),
    marginBottom: s(16),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(1) },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: ms(15),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  orderDate: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginTop: s(2),
  },
  statusBadge: {
    paddingHorizontal: s(12),
    paddingVertical: s(4),
    borderRadius: ms(12),
  },
  statusText: {
    fontSize: ms(12),
    fontWeight: '500',
    color: '#FFFFFF',
  },
  divider: {
    height: s(1),
    backgroundColor: '#F0F0F0',
    marginVertical: s(12),
  },
  orderContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: s(60),
    height: s(60),
    borderRadius: ms(8),
    backgroundColor: '#F5F5F5',
  },
  orderDetails: {
    flex: 1,
    marginLeft: s(12),
    justifyContent: 'center',
  },
  orderItemsText: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginBottom: s(4),
  },
  productNameText: {
    fontSize: ms(15),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: s(4),
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalPrice: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: s(4),
  },
  paymentMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: s(8),
    paddingVertical: s(3),
    borderRadius: ms(10),
    marginTop: s(4),
  },
  paymentMethodText: {
    fontSize: ms(10),
    color: theme.colors.textSecondary,
    marginLeft: s(4),
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(12),
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressText: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    marginLeft: s(4),
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: s(12),
    paddingVertical: s(6),
    borderRadius: ms(16),
  },
  detailsButtonText: {
    fontSize: ms(12),
    fontWeight: '500',
    color: theme.colors.primary,
    marginRight: s(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(32),
  },
  emptyTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: s(16),
    marginBottom: s(8),
  },
  emptyText: {
    fontSize: ms(14),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: s(24),
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: s(24),
    paddingVertical: s(12),
    borderRadius: ms(24),
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: ms(16),
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: s(4),
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: s(3),
    borderRadius: ms(12),
  },
  categoryText: {
    fontSize: ms(10),
    fontWeight: '600',
    marginLeft: s(4),
  },
});

export default CustomerOrdersScreen;
