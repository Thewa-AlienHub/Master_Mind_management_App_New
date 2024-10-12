import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../../Utils/colors";

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get totalAmount from route parameters 
  const { totalAmount } = route.params;

  const handleOk = () => {
    navigation.navigate('cart', { clearCart: true }); // Navigate to Cart page and clear cart
  };

  return (
    <View style={styles.container}>
      {/* Success Message Container */}
      <View style={styles.container2}>
          <View style={styles.topBarTextContainer}>
          <Image
                source={require("../../assets/logo (1).png")}
                style={styles.visaImg}
            />
              <Text style={styles.TopBar}>You are successfully</Text>
              <Text style={styles.TopBar1}>Make the </Text>
              <Text style={styles.TopBar1}>Payment</Text>
            </View>

      </View>
      <View style={styles.container3}>
      <View style={styles.messageContainer}>
        <View style={styles.checkIconContainer}>
          {/* Check Icon */}
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        {/* Success Text */}
        <Text style={styles.successText}>
          Payment of LKR {totalAmount} was successful!
        </Text>

        {/* OK Button */}
        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
          <Text style={styles.okButtonText}>Ok</Text>
        </TouchableOpacity>

        <Text style={styles.qouteText}>Recycle More, Earn More!</Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
   

  },
  container2:{
    backgroundColor: '#567FE8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    width: '100%',
    borderBottomStartRadius: 120,
    borderBottomEndRadius: 120,
    alignItems: 'center',
    position: 'relative',
    minHeight: 290,
  },
  TopBar: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    top:-37
  },
  TopBar1: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    fontSize: 32,
    color: colors.white,
    fontWeight: 'bold',
    top:-35
  },
  topBarTextContainer: {
    flexDirection: 'column', 
    alignItems: 'center',    
    justifyContent: 'center',
  },
  container3:{
    top:30,
    alignItems:'center'
  },
  messageContainer: {
    width: "80%",
    backgroundColor: '#F0F3FF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderColor: "#567FE8",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems:'center'
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#002C9D',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 70,
    color: colors.white,
  },
  successText: {
    fontSize: 20,
    color: '#002C9D',
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  qouteText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
  },
  okButton: {
    backgroundColor: '#002C9D',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: colors.white,
    fontSize: 24,
  },
});

export default SuccessScreen;
