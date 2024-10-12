import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  DB,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "../../config/DB_config"; // Import necessary functions
import { query, where } from "firebase/firestore";
import colors from "../../Utils/colors";
import MenuButton from "../../Components/MenuButton";

const RequestLeave = ({ drawer, data, navigation, route }) => {
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [leaveType, setLeaveType] = useState("Short Leave");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const { leaveRequest } = route.params || {};

  // Get the user's email from the data parameter
  const email = data.data.email;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = collection(DB, "Users"); // Assuming the user collection is named "Users"
        const q = query(userRef, where("staffId", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setStaffId(email); // Assuming you have a staffId field in user data
          setStaffName(`${userData.FirstName} ${userData.LastName}`); // Combine first and last name
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [email]); // Fetch data when the component mounts or email changes

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const handleSubmit = async () => {
    setError({});
    let isValid = true;
    let newErrors = {};

    if (!reason.trim()) {
      newErrors.reason = "Reason is required";
      isValid = false;
    }

    if (!isValid) {
      setError(newErrors);
      return;
    }

    try {
      setLoading(true);

      if (leaveRequest) {
        // Update existing leave request
        await updateDoc(doc(DB, "LeaveRequests", leaveRequest.id), {
          leaveType,
          reason,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        navigation.navigate("UpdateSuccess");
      } else {
        // Create new leave request
        const leaveRequestRef = collection(DB, "LeaveRequests");

        // Check for existing leave requests to generate the new ID
        const userLeavesQuery = await getDocs(
          query(leaveRequestRef, where("staffId", "==", email))
        );

        let newSuffix = 1;

        if (!userLeavesQuery.empty) {
          const suffixes = userLeavesQuery.docs.map((doc) => {
            const id = doc.id;
            const parts = id.split("_l");
            return parseInt(parts[1], 10) || 0;
          });

          newSuffix = Math.max(...suffixes) + 1;
        }

        const newDocumentId = `${email}_l${newSuffix}`;
        const leaveRequestDocRef = doc(leaveRequestRef, newDocumentId);
        const RequestedDate = serverTimestamp();

        await setDoc(leaveRequestDocRef, {
          staffId: email,
          RequestDate: RequestedDate,
          staffName: data.data.FirstName,
          leaveType,
          reason,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: "Pending",
        });

        console.log("Request leave recorded with document ID:", newDocumentId);

        // Reset fields after successful submission
        setLeaveType("Short Leave");
        setReason("");
        setStartDate(new Date());
        setEndDate(new Date());

        navigation.navigate("LeaveSuccess");
      }
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leaveRequest) {
      setLeaveType(leaveRequest.leaveType);
      setReason(leaveRequest.reason);
      setStartDate(leaveRequest.startDate);
      setEndDate(leaveRequest.endDate);

      if (leaveRequest.startDate && leaveRequest.endDate) {
        setStartDate(new Date(leaveRequest.startDate));
        setEndDate(new Date(leaveRequest.endDate));
      }
    }
  }, [leaveRequest]);

  const handleUpdate = async () => {
    if (leaveRequest) {
      try {
        await updateDoc(doc(DB, "LeaveRequests", leaveRequest.id), {
          leaveType,
          reason,
          startDate,
          endDate,
        });
        Alert.alert("Success", "Leave request updated successfully!");
        navigation.goBack(); // Navigate back after updating
      } catch (error) {
        console.error("Error updating leave request: ", error);
        Alert.alert("Error", "Failed to update the leave request.");
      }
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

      {/* Headings */}
      <Text style={styles.headerText1}>Request</Text>
      <Text style={styles.headerText2}>Leave</Text>

      {/* Scrollable Form Fields */}
      <View style={styles.TopBarContainer}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Staff ID:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Staff ID"
            value={email}
            editable={false}
          />
          <Text style={styles.label}>Staff Name:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Staff Name"
            value={data.data.FirstName}
            editable={false}
          />

          <Text style={styles.label}>Leave Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={leaveType}
              onValueChange={(itemValue) => setLeaveType(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Short Leave" value="Short Leave" />
              <Picker.Item label="Sick Leave" value="Sick Leave" />
              <Picker.Item label="Maternity Leave" value="Maternity Leave" />
              <Picker.Item label="Casual Leave" value="Casual Leave" />
            </Picker>
          </View>

          <Text style={styles.label}>Reason:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Reason for leave"
            value={reason}
            onChangeText={setReason}
          />
          {error.reason && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.reason}</Text>
            </Animated.View>
          )}

          <Text style={styles.label}>Start Date and Time:</Text>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={styles.inputBox}
          >
            <Text>
              {`${startDate ? startDate.toLocaleDateString() : "Select Date"} ${
                startDate
                  ? startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }`}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false); // Close the picker
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>End Date and Time:</Text>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.inputBox}
          >
            <Text>
              {`${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}`}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false); // Close the picker
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.ButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {leaveRequest ? "Update" : "Submit"} Leave Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
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
  TopBarContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    marginTop: 170,
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  label: {
    paddingLeft: 25,
    paddingTop: 20,
    fontSize: 16,
    color: colors.secondary,
  },
  inputBox: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    borderColor: colors.secondary,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 5,
  },
  pickerContainer: {
    marginHorizontal: 20,
    borderColor: colors.secondary,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    height: 50,

    marginTop: 5,
    justifyContent: "center",
  },
  ButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: colors.white,
    elevation: 5,
  },
  button: {
    backgroundColor: colors.Button1,
    borderRadius: 25,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
  },
  errorText: {
    color: "red",
    paddingLeft: 20,
    fontSize: 14,
  },
  menubtn: {
    marginTop: 40,
    marginLeft: 10,
    position: "absolute",
  },
});

export default RequestLeave;
