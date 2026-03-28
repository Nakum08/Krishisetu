import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import ProductListingScreen from '../screens/ProductListingScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import ReportingScreen from '../screens/ReportingScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import FarmerDashboard from '../screens/FarmerDashboard';
import FarmerProfileScreen from '../screens/FarmerProfileScreen';

const Tab = createBottomTabNavigator();

const FarmerBottomTabNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Products') {
            iconName = 'basket';
          } else if (route.name === 'Orders') {
            iconName = 'cart';
          } else if (route.name === 'Reports') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          height: 60,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          // iOS shadow
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          zIndex: 999,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={FarmerDashboard} 
        options={{ title: t('navigation.home') }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductListingScreen} 
        options={{ title: t('navigation.products') }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderManagementScreen} 
        options={{ title: t('navigation.orders') }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportingScreen} 
        options={{ title: t('navigation.analytics') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={FarmerProfileScreen} 
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

export default FarmerBottomTabNavigator;