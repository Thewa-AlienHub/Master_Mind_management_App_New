

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import MainBar from './app/screens/MainBar';
import AddProperty from './app/screens/Sasindu/AddProperty';
import ManageProperty from './app/screens/Sasindu/ManageProperty';
import UpdateAndDeleteProperty from './app/screens/Sasindu/UpdateAndDeleteProperty';
import MarketPlace from './app/screens/Sasindu/MarketPlace';
import SelectedItemView from './app/screens/Sasindu/SelectedItemView';
import Cart from './app/screens/Sasindu/Cart';
import PlaceOrder from './app/screens/Sasindu/PlaceOrder';
import AddCardDetails from './app/screens/Sasindu/AddCardDetails';
import SuccessScreen from './app/screens/Sasindu/SuccessScreen_01';
import OrderDetails from './app/screens/Sasindu/OrderDetails';
import MyOrders from './app/screens/Sasindu/MyOrders';
import AddPropertyNotification from './app/screens/Sasindu/AddPropertyNotification';




const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

      <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='Signup'
          component={SignUp}
          options={{headerShown : false}}
        />
     
     <Stack.Screen
          name='MainBar'
          component={MainBar}
          options={{headerShown : false}}
        />

        {/*sasindu*/}
        
    <Stack.Screen
          name='addProperty'
          component={AddProperty}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='viewProperty'
          component={ManageProperty}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='updateDelete'
          component={UpdateAndDeleteProperty}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='marketplace'
          component={MarketPlace}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='view'
          component={SelectedItemView}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='cart'
          component={Cart}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='placeOrder'
          component={PlaceOrder}
          options={{headerShown : false}}
        /> 
    <Stack.Screen
          name='addCard'
          component={AddCardDetails}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='success'
          component={SuccessScreen}
          options={{headerShown : false}}
        /> 
    <Stack.Screen
          name='orderDetails'
          component={OrderDetails}
          options={{headerShown : false}}
        />
    <Stack.Screen
          name='myOrders'
          component={MyOrders}
          options={{headerShown : false}}
        />   
    <Stack.Screen
          name='addNotification'
          component={AddPropertyNotification}
          options={{headerShown : false}}
        />   

        
      </Stack.Navigator>
    </NavigationContainer>

  );
}



