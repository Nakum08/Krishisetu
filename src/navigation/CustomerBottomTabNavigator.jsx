import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import theme from '../theme';

import CustomerDashboard from '../screens/CustomerDashboard';
import ExploreScreen from '../screens/ExploreScreen';
import CustomerOrdersScreen from '../screens/CustomerOrdersScreen';
import CustomerCartScreen from '../screens/CustomerCartScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import OrderScreen from '../screens/OrderScreen';

const Tab = createBottomTabNavigator();

const CustomerBottomTabNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header if not needed
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Explore':
              iconName = 'search-outline';
              break;
            case 'Orders':
              iconName = 'list-outline';
              break;
            case 'Cart':
              iconName = 'cart-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={CustomerDashboard} 
        options={{ title: t('navigation.home') }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{ title: t('navigation.products') }}
      />
      <Tab.Screen 
        name="Orders" 
        component={CustomerOrdersScreen} 
        options={{ title: t('navigation.orders') }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CustomerCartScreen} 
        options={{ title: t('navigation.cart') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={CustomerProfileScreen} 
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

export default CustomerBottomTabNavigator;
