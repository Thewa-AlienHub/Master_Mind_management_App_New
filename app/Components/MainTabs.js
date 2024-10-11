import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../Utils/colors";
import Home from "../screens/Home"; // Import your Home component
import Profile from "../screens/Profile_04";
import Profile3 from "./../screens/Profile3";
// Import your Profile3 component

const Tab = createBottomTabNavigator();

const MainTabs = ({ navigation, drawer, data }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 15,
          backgroundColor: colors.white,
          height: 60,
          borderWidth: 0,
        },
        tabBarIconStyle: {
          borderWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={30} />
          ),
        }}
      >
        {() => <Home drawer={drawer} />}
      </Tab.Screen>

      <Tab.Screen
        name="Amenity_List"
       
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-sharp" color={color} size={30} />
          ),
        }}
      >
        {() => <Profile navigation={navigation} drawer={drawer} data={data} />}
        </Tab.Screen>
      <Tab.Screen
        name="Shopping_Cart"
        component={Profile3} // Assuming Profile3 is used here
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-sharp" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-sharp" color={color} size={30} />
          ),
        }}
      >
        {() => <Profile drawer={drawer} data={data} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabs;
