import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import colors from "../../Utils/colors";
import MenuButton from "../../Components/MenuButton";
import {
  DB,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "../../config/DB_config";
import { query, where, orderBy, limit } from "firebase/firestore";

const AttendanceScreen = ({ drawer, navigation, data }) => {
  const [mode, setMode] = useState("Check In");
  const [isCheckInButtonDisabled, setIsCheckInButtonDisabled] = useState(false);
  const [isCheckOutButtonDisabled, setIsCheckOutButtonDisabled] =
    useState(true);
  const [currentDate, setCurrentDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);

  // Get the user's email from the data parameter
  const email = data.data.email;

  // This effect runs when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toDateString();
      // Reset states if the date changes
      if (currentDate !== today) {
        setMode("Check In");
        setIsCheckInButtonDisabled(false);
        setIsCheckOutButtonDisabled(true);
        setCurrentDate(today);
      }
    }, [currentDate])
  );

  const toggleMode = (newMode) => {
    setMode(newMode);
  };

  const handleFaceRecognition = () => {
    if (mode === "Check In") {
      handleCheckIn();
    } else if (mode === "Check Out") {
      handleCheckOut();
    }
  };

  const handleCheckIn = async () => {
    try {
      const attendanceCollectionRef = collection(DB, "attendance");
      const snapshot = await getDocs(
        query(attendanceCollectionRef, where("userId", "==", email))
      );

      let newSuffix = 1;

      if (!snapshot.empty) {
        const suffixes = snapshot.docs.map((doc) => {
          const id = doc.id;
          const parts = id.split("_a");
          return parseInt(parts[1], 10) || 0;
        });

        newSuffix = Math.max(...suffixes) + 1;
      }

      const newDocumentId = `${email}_a${newSuffix}`;
      const attendanceDocRef = doc(attendanceCollectionRef, newDocumentId);
      const checkInTimestamp = serverTimestamp();

      await setDoc(attendanceDocRef, {
        userId: email,
        checkInTime: checkInTimestamp,
        checkOutTime: null,
      });

      console.log("Check-in time recorded with document ID:", newDocumentId);

      setIsCheckInButtonDisabled(true);
      setIsCheckOutButtonDisabled(false);
      setCheckInTime(checkInTimestamp);
      navigation.navigate("CISuccessScreen", { checkInTime: checkInTimestamp });
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const attendanceCollectionRef = collection(DB, "attendance");

      // Get the documents sorted by creation timestamp (checkInTime) in descending order
      const snapshot = await getDocs(
        query(
          attendanceCollectionRef,
          where("userId", "==", email),
          orderBy("checkInTime", "desc"),
          limit(1) // Only get the most recent check-in
        )
      );

      let documentIdToUpdate;
      if (!snapshot.empty) {
        documentIdToUpdate = snapshot.docs[0].id; // Get the latest document
      } else {
        console.error("No check-in record found for check-out.");
        return;
      }

      const attendanceDocRef = doc(DB, "attendance", documentIdToUpdate);

      // Update the checkOutTime
      await updateDoc(attendanceDocRef, {
        checkOutTime: serverTimestamp(),
      });

      console.log(
        "Check-out time recorded for document ID:",
        documentIdToUpdate
      );
      setIsCheckOutButtonDisabled(true);
      navigation.navigate("COSuccessScreen");
    } catch (error) {
      console.error("Error during check-out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menubtn}>
        <MenuButton
          color={colors.white}
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
      <Text style={styles.headerText1}>Mark</Text>
      <Text style={styles.headerText2}>Attendance</Text>

      <View style={styles.TopBarContainer}>
        <View style={styles.rectangleContainer}>
          <View style={styles.toggleButton}>
            <TouchableOpacity
              onPress={() => toggleMode("Check In")}
              style={[
                styles.checkOption,
                mode === "Check In" ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text
                style={
                  mode === "Check In" ? styles.activeText : styles.inactiveText
                }
              >
                Check In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleMode("Check Out")}
              style={[
                styles.checkOption,
                mode === "Check Out" ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text
                style={
                  mode === "Check Out" ? styles.activeText : styles.inactiveText
                }
              >
                Check Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faceRecognitionFrame}>
          <Text style={styles.faceText}>Place your face inside the frame</Text>
          <Text style={styles.faceIcon}>👤</Text>
        </View>

        <TouchableOpacity
          onPress={handleFaceRecognition}
          style={[
            styles.checkInButton,
            (mode === "Check In" && isCheckInButtonDisabled) ||
            (mode === "Check Out" && isCheckOutButtonDisabled)
              ? { backgroundColor: "gray" }
              : {},
          ]}
          disabled={
            (mode === "Check In" && isCheckInButtonDisabled) ||
            (mode === "Check Out" && isCheckOutButtonDisabled)
          }
        >
          <Text style={styles.buttonText}>{mode}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.secondary,
  },
  TopBarContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    marginTop: 170,
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText1: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "bold",
    position: "absolute",
    top: 70,
    right: 40,
  },
  headerText2: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "bold",
    position: "absolute",
    top: 115,
    right: 40,
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  checkOption: {
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  rectangleContainer: {
    width: 300,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    height: 60,
    zIndex: 0,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  activeText: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "bold",
  },
  inactiveText: {
    fontSize: 18,
    color: colors.black,
  },
  faceRecognitionFrame: {
    width: 250,
    height: 250,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    backgroundColor: colors.secondary,
  },
  faceIcon: {
    fontSize: 100,
    color: "grey",
  },
  faceText: {
    position: "absolute",
    top: 260,
    fontSize: 16,
    color: "#555",
  },
  checkInButton: {
    width: 300,
    padding: 12,
    marginTop: 40,
    backgroundColor: colors.Button1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  menubtn: {
    marginTop: 40,
    marginLeft: 10,
    position: "absolute",
  },
});

export default AttendanceScreen;
