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
import Profile from "./Profile";
import MainTabs from "../Components/MainTabs";
import Profile3 from "./Profile3";
import AttendanceScreen from "./Pradi/AttendanceScreen";
import RequestLeave from "./Pradi/RequestLeave";
import ViewAttendance from "./Pradi/ViewAttendance";
import SuccessScreen from "./Pradi/SuccessScreen";

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
          {(props) => (
            <Profile3
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
        <Stack.Screen name="SuccessScreen">
          {(props) => (
            <SuccessScreen
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
