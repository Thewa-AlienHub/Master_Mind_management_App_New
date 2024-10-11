import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  DrawerLayoutAndroid,
  Dimensions,
} from "react-native";
import colors from "../Utils/colors";
import Icon from "react-native-vector-icons/Ionicons";
import DrawerComponent from "./drawerComponent";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import Login from "./Login";
import MenuButton from "../Components/MenuButton"; // Import the externalized menu button
import Profile_04 from "./Profile_04";
import MainTabs from "../Components/MainTabs";
import Profile3 from "./Profile3";
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
