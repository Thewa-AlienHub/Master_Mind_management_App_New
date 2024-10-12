import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  DrawerLayoutAndroid,
  Dimensions,
} from 'react-native';
import colors from '../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerComponent from './drawerComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Login from './Login';
import MenuButton from '../Components/MenuButton'; // Import the externalized menu button
import Profile from './Profile';
import MainTabs from '../Components/MainTabs';
import Profile3 from './Profile3';
import Profile_04 from "./Profile_04";
import AmenityBookingList_03 from './Thewan/Admin_03/AmenityBookingList_03';
import TeamList_03 from './Thewan/Admin_03/TeamList_03';
import NotificationManagement_03 from './Thewan/Admin_03/NotificationManagement_03';
import AmenityList_03 from './Thewan/User_03/AmenityList_03';
import MakeReservation_03 from './Thewan/User_03/MakeReservation_03';
import SuccessScreen_03 from './Thewan/Admin_03/SuccessScreen_03';
import SuccessScreen02_03 from './Thewan/User_03/SuccessScreen02_03';
import ReservationList_03 from './Thewan/User_03/ReservationList_03';
import EditReservation_03 from './Thewan/User_03/EditReservation_03';
import SuccessScreen02_03edit from './Thewan/User_03/SuccessScreen02_03edit';
import SuccessScreen02_03delete from './Thewan/User_03/SuccessScreen02_03delete';
import AmenityListAdmin_03 from './Thewan/Admin_03/AmenityListAdmin_03';
import AttendanceScreen from "./Pradi/AttendanceScreen";
import RequestLeave from "./Pradi/RequestLeave";
import ViewAttendance from "./Pradi/ViewAttendance";
import CISuccessScreen from "./Pradi/CISuccessScreen";
import ViewLeaveRequest from "./Pradi/ViewLeaveRequest";
import COSuccessScreen from "./Pradi/COSuccessScreen";
import LeaveSuccess from "./Pradi/LeaveSuccess";
import UpdateSuccess from "./Pradi/UpdateSuccess";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainBar = ({ navigation, route }) => {
  const drawer = useRef(null);
  const  {data}  = route.params;

  const screenWidth = Dimensions.get('window').width;

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={screenWidth}
      drawerPosition="left"
      renderNavigationView={() => <DrawerComponent navigation={navigation} drawer={drawer} data = {data} />}
    >
      
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
          {(props) => <MainTabs {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="Profile3">
          {(props) => <Profile3 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="AmenityBookingList_03">
          {(props) => <AmenityBookingList_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="TeamList_03">
          {(props) => <TeamList_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="NotificationManagement_03">
          {(props) => <NotificationManagement_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="AmenityList_03">
          {(props) => <AmenityList_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="AmenityListAdmin_03">
          {(props) => <AmenityListAdmin_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="MakeReservation_03">
          {(props) => <MakeReservation_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="SuccessScreen_03">
          {(props) => <SuccessScreen_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="SuccessScreen02_03">
          {(props) => <SuccessScreen02_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="SuccessScreen02_03edit">
          {(props) => <SuccessScreen02_03edit {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="SuccessScreen02_03delete">
          {(props) => <SuccessScreen02_03delete {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="ReservationList_03">
          {(props) => <ReservationList_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="EditReservation_03">
          {(props) => <EditReservation_03 {...props} navigation={navigation} drawer={drawer} data={data} />}  
        </Stack.Screen>
        <Stack.Screen name="Profile_04">
          {(props) => (
            <Profile_04
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Attendance">
          {(props) => (
            <AttendanceScreen
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RequestLeave">
          {(props) => (
            <RequestLeave
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ViewAttendance">
          {(props) => (
            <ViewAttendance
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CISuccessScreen">
          {(props) => (
            <CISuccessScreen
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="COSuccessScreen">
          {(props) => (
            <COSuccessScreen
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ViewLeaveRequest">
          {(props) => (
            <ViewLeaveRequest
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="LeaveSuccess">
          {(props) => (
            <LeaveSuccess
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="UpdateSuccess">
          {(props) => (
            <UpdateSuccess
              {...props}
              navigation={navigation}
              drawer={drawer}
              data={data}
            />
          )}
        </Stack.Screen>
        
      </Stack.Navigator>
    </DrawerLayoutAndroid>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    shadowColor: colors.backgroundcolor1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  // Other styles remain the same
});

export default MainBar;
