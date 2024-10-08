

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
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}



