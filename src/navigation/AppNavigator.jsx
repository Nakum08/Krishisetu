import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthScreen from '../screens/AuthScreen';
import ForgotPassword from '../components/ForgotPassword';
import GoogleSignInScreen from '../screens/GoogleSignInScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import FarmerBottomTabNavigator from './FarmerBottomTabNavigator';
import CustomerBottomTabNavigator from './CustomerBottomTabNavigator';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderScreen from '../screens/OrderScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import PaymentProcessingScreen from '../screens/PaymentProcessingScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import CustomerOrdersScreen from '../screens/CustomerOrdersScreen';
import ExploreScreen from '../screens/ExploreScreen';
import FarmerProfileScreen from '../screens/FarmerProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import CustomerCartScreen from '../screens/CustomerCartScreen';
import CustomerDashboard from '../screens/CustomerDashboard';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AuthLoading">
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainApp"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="GoogleSignIn" 
        component={GoogleSignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CompleteProfile" 
        component={CompleteProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      {/* Farmer's Bottom Tabs */}
      <Stack.Screen 
        name="FarmerMain"
        component={FarmerBottomTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Customer's Bottom Tabs */}
      <Stack.Screen 
        name="CustomerMain"
        component={CustomerBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
  name="CategoryProductsScreen"
  component={CategoryProductsScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={{ headerShown: false }}
      />

       <Stack.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="PaymentProcessingScreen"
        component={PaymentProcessingScreen}
        options={{ headerShown: false }}
      />

        <Stack.Screen
        name="OrderConfirmationScreen"
        component={OrderConfirmationScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="OrderTrackingScreen"
        component={OrderTrackingScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="CustomerOrdersScreen"
        component={CustomerOrdersScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="FarmerProfileScreen"
        component={FarmerProfileScreen}
        options={{ headerShown: false }}
      />
<Stack.Screen
        name="AddPostScreen"
        component={AddPostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerCartScreen"
        component={CustomerCartScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>    
  );
};

export default AppNavigator;
