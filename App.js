

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import MainBar from './app/screens/MainBar';
import MainTabs from './app/Components/MainTabs';
import SuccessScreen_03 from './app/screens/Thewan/Admin_03/SuccessScreen_03';
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
import MaintenanceAdd from './app/screens/kk/MaintenanceAdd';
import ElectricalIssues from './app/screens/kk/ElectricalIssues';
import SecurityIssues from './app/screens/kk/SecurityIssues';
import FixedLineIssues from './app/screens/kk/FixedLineIssues';
import ConstructionIssues from './app/screens/kk/ConstructionIssues';
import PlumbingIssues from './app/screens/kk/PlumbingIssues';
import ACIssues from './app/screens/kk/ACIssues';
import DoneScreen from './app/screens/kk/DoneScreen';
import MaintenanceAddAdmin from './app/screens/kk/Admin/MaintenanceAddAdmin';
import ElectricalIssuesAdmin from './app/screens/kk/Admin/ElectricalIssuesAdmin';
import IssuesEmailWise from './app/screens/kk/Admin/IssuesEmailWise';
import IssueList from './app/screens/kk/IssueList';
import ViewIssueSimple from './app/screens/kk/ViewIssueSimple';
import ViewIssueComplex from './app/screens/kk/ViewIssueComplex';
import EditIssueSimple from './app/screens/kk/EditIssueSimple';
import EditIssueComplex from './app/screens/kk/EditIssueComplex';
import MaintenanceAddForHome from './app/screens/kk/MaintenanceAddForHome';
import ViewIssueSimpleAdmin from './app/screens/kk/Admin/ViewIssuesSimpleAdmin';
import ViewIssueComplexAdmin from './app/screens/kk/Admin/ViewIssueComplexAdmin';
import LandingPage from './app/screens/LandingPage';




const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='LandingPage'>

      <Stack.Screen
          name='LandingPage'
          component={LandingPage}
          options={{headerShown : false}}
        />
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
        

         {/**K K  */}

         <Stack.Screen
          name="MaintenanceAdd"
          component={MaintenanceAdd}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="MaintenanceAddForHome"
          component={MaintenanceAddForHome}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="ElectricalIssues"
          component={ElectricalIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="SecurityIssues"
          component={SecurityIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="FixedLineIssues"
          component={FixedLineIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="ConstructionIssues"
          component={ConstructionIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="PlumbingIssues"
          component={PlumbingIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="ACIssues"
          component={ACIssues}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="DoneScreen"
          component={DoneScreen}
          options={{headerShown : false}}
        />
      {/*admin*/}

      <Stack.Screen
          name="MaintenanceAddAdmin"
          component={MaintenanceAddAdmin}
          options={{headerShown : false}}
        />
      <Stack.Screen
          name="ElectricalIssuesAdmin"
          component={ElectricalIssuesAdmin}
          options={{headerShown : false}}
        />
      <Stack.Screen
          name="IssuesEmailWise"
          component={IssuesEmailWise}
          options={{headerShown : false}}
        />
      <Stack.Screen
          name="ViewIssueSimpleAdmin"
          component={ViewIssueSimpleAdmin}
          options={{headerShown : false}}
        />
      <Stack.Screen
          name="ViewIssueComplexAdmin"
          component={ViewIssueComplexAdmin}
          options={{headerShown : false}}
        />


       
      

        {/*Issues cards screen */}
        <Stack.Screen
          name="IssueList"
          component={IssueList}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="ViewIssueSimple"
          component={ViewIssueSimple}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="ViewIssueComplex"
          component={ViewIssueComplex}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="EditIssueSimple"
          component={EditIssueSimple}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name="EditIssueComplex"
          component={EditIssueComplex}
          options={{headerShown : false}}
        />


      </Stack.Navigator>
      
    </NavigationContainer>

  );
}



