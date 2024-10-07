import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Utils/colors'; // Import your color utility if needed

const Profile3 = ({ navigation,drawer, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      {/* You can add more components and data display here */}
      <Text>Name: {data.name}</Text>
      <Text>Email: {data.email}</Text>
      {/* Example of using the drawer */}
      <Text onPress={() => navigation.navigate('Home')} style={styles.menuButton}>
        Home
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundcolor1, // Use your color utility
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuButton: {
    fontSize: 18,
    color: colors.primary, // Adjust color as needed
    marginTop: 20,
  },
});

export default Profile3;
