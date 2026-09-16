import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/loginScreen';
import OtpScreen from '../screens/OtpScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterOtpScreen from '../screens/RegisterOtpScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import { navigationRef } from './navigationRef';
import AdminHomeScreen from '../screens/AdminScreen';
import AdminProductsScreen from '../screens/AdminProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AdminMarketRatesScreen from '../screens/AdminMarketScreen';
import AdminProductRatesScreen from '../screens/AdminProductrateScreen';
import ProductRateHistoryScreen from '../screens/ProductRateHistoryScreen';
import AddProductRateScreen from '../screens/AddProductRateScreen';
import EditProductRateScreen from '../screens/EditProductRateScreen';
import AdminOrdersScreen from '../screens/AdminOrderScreen';
import AdminOrderDetailsScreen from '../screens/AdminOrderDetailScreen';

export type RootStackParamList = {
  Login: undefined;

  Otp: {
    identifier: string;
  };

  Register: undefined;

  RegisterOtp: {
    identifier: string;
  };

  CompleteProfile: {
    identifier: string;
    token:string
  };
  Home:undefined;
  ProductDetails: {
    productId: number;
  };
  MyOrders: undefined;
 AdminHome: undefined;
 AdminMarketRates:undefined;
  AdminProducts: undefined;
  ProductRateHistory: {
  productId: number;
};
  AddProduct: undefined;
  EditProduct: {productId: number};
  AdminProductRates: undefined;
  AddProductRate: undefined;
  EditProductRate: {rateId: number};
  AdminOrders: undefined;
AdminOrderDetails: {
  orderId: number;
};};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
  name="Otp"
  component={OtpScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="Register"
  component={RegisterScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="RegisterOtp"
  component={RegisterOtpScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="CompleteProfile"
  component={CompleteProfileScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="ProductDetails"
  component={ProductDetailsScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="MyOrders"
  component={MyOrdersScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="AdminHome"
  component={AdminHomeScreen}
  options={{headerShown: false}}
/>
     <Stack.Screen
  name="AdminProducts"
  component={AdminProductsScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="AddProduct"
  component={AddProductScreen}
  options={{
    title: 'Add Product',
  }}
/>
<Stack.Screen 
name="EditProduct"
 component={EditProductScreen} 
 options={{ headerShown: false, }} />
 <Stack.Screen name="AdminMarketRates" 
 component={AdminMarketRatesScreen}
  options={{ headerShown: false, }} />
  <Stack.Screen
  name="AdminProductRates"
  component={AdminProductRatesScreen}
  options={{
    headerShown: false,
  }}
/><Stack.Screen 
name="ProductRateHistory" 
component={ProductRateHistoryScreen} 
options={{ headerShown: false, }} />
<Stack.Screen
  name="AddProductRate"
  component={AddProductRateScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="EditProductRate"
  component={EditProductRateScreen}
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="AdminOrders"
  component={AdminOrdersScreen}
/>
<Stack.Screen
  name="AdminOrderDetails"
  component={AdminOrderDetailsScreen}
/>
      </Stack.Navigator>
 
    </NavigationContainer>
  );
}

export default AppNavigator;