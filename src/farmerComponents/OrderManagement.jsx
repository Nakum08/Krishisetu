import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from '../services/firebase';
import OrderCard from './OrderCard';
import OrderFilters from './OrderFilters';
import EmptyOrderState from './EmptyOrderState';
import UnifiedHeader from '../components/UnifiedHeader';
import {updateOrderStatus} from '../services/firestoreSeedOrders';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const db = getFirestore(app);
const SCREEN_WIDTH = Dimensions.get('window').width;

const OrderManagement = ({ navigation }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      
      // Get current farmer ID from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('OrderManagement - Farmer ID from AsyncStorage:', userToken);
      
      if (!userToken) {
        console.log('No farmer ID found, cannot fetch orders');
        setOrders([]);
        return;
      }
      
      // Fetch orders for this specific farmer
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('farmerId', '==', userToken));
      const querySnapshot = await getDocs(q);
      
      const allOrders = [];
      querySnapshot.forEach((doc) => {
        allOrders.push({ ...doc.data(), docId: doc.id });
      });
      
      console.log(`Found ${allOrders.length} orders for farmer ${userToken}`);
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllOrders();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllOrders();
    setRefreshing(false);
  };
  
  const handleStatusUpdate = async (orderId, newStatus) => {
    // try {
    //   setOrders(prevOrders => 
    //     prevOrders.map(order => 
    //       order.id === orderId ? {...order, status: newStatus} : order
    //     )
    //   );
    // } catch (error) {
    //   console.error('Error updating order status:', error);
    // }





    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.docId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  const filterOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => {
      switch(activeFilter) {
        case 'pending': return order.status === 'confirmed';
        case 'processing': return order.status === 'processing';
        case 'shipped': return order.status === 'shipped' || order.status === 'out_for_delivery';
        case 'delivered': return order.status === 'delivered';
        default: return true;
      }
    });
  };
  
  const filteredOrders = filterOrders();
  
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('farmer.loadingOrders')}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.rootContainer}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <UnifiedHeader
        title={t('farmer.orders')}
        subtitle={t('farmer.manageAllOrders')}
        showCartButton={false}
        showMenuButton={false}
        containerStyle={styles.headerContainer}
        titleStyle={styles.headerTitle}
        subtitleStyle={styles.headerSubtitle}
      />
      
      <View style={styles.filterContainer}>
        <OrderFilters 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
        />
      </View>
      
      <View style={styles.listContainer}>
        {filteredOrders.length === 0 ? (
          <EmptyOrderState filterType={activeFilter} />
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id || item.docId}
            renderItem={({ item }) => (
              <OrderCard 
                order={item} 
                onStatusUpdate={handleStatusUpdate} 
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4CAF50"]}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: s(0),
    paddingVertical: s(15),
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: ms(24),
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
  },
  filterContainer: {
    marginVertical: s(0),
    paddingVertical: s(10),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
    flex: 1,
    padding: s(10),

  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: s(10),
    fontSize: ms(16),
    color: '#555',
  },
  listContent: {
    paddingHorizontal: s(0),
    paddingVertical: s(0),
  }
});

export default OrderManagement;