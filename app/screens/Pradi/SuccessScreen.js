import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../../Utils/colors";
import Icon from "react-native-vector-icons/Ionicons";
import { DB, doc, getDoc } from "../../config/DB_config";

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract checkInTime from route parameters
  const { checkInTime: routeCheckInTime } = route.params || {};

  const userId = "USER_ID"; // Replace with actual user ID

  useEffect(() => {
    const fetchCheckInTime = async () => {
      if (routeCheckInTime) {
        setCheckInTime(routeCheckInTime.toDate()); // Convert timestamp to Date object
        setLoading(false);
        return;
      }

      try {
        // DB document reference for this user's attendance entry
        const attendanceDocRef = doc(DB, `attendance/${userId}`);
        const docSnap = await getDoc(attendanceDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCheckInTime(data.checkInTime.toDate());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching check-in time:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckInTime();
  }, [routeCheckInTime]);

  const handleOk = () => {
    navigation.navigate("Attendance");
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.TopBarContainer}>
        <Text style={styles.headerText1}>Check-In</Text>
        <Text style={styles.headerText2}>Successful</Text>
      </View>

      {/* Success Icon and Check-In Time */}
      <View style={styles.successContainer}>
        {/* Checkmark Icon */}
        <Icon
          name="checkmark-circle-outline"
          size={100}
          color={colors.primary}
          style={styles.checkIcon}
        />

        {/* Check-In Date and Time */}
        {loading ? (
          <Text style={styles.checkInTimeText}>Loading...</Text>
        ) : (
          checkInTime && (
            <Text style={styles.checkInTimeText}>
              Check-In Time: {new Date(checkInTime).toLocaleString()}
            </Text>
          )
        )}
      </View>

      {/* OK Button */}
      <TouchableOpacity style={styles.okButton} onPress={handleOk}>
        <Text style={styles.okButtonText}>Ok</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  TopBarContainer: {
    backgroundColor: colors.primary,
    borderBottomStartRadius: 130,
    borderBottomEndRadius: 130,
    height: 400,
    flex: 0,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText1: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "bold",
    position: "absolute",
    top: 200,
  },
  headerText2: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "bold",
    position: "absolute",
    top: 250,
  },
  successContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  checkIcon: {
    marginBottom: 20,
  },
  checkInTimeText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 0,
  },
  okButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
  okButtonText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default SuccessScreen;
