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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { DB, collection, addDoc } from "../../config/DB_config"; // DB import
import colors from "../../Utils/colors";
import MenuButton from "../../Components/MenuButton";

const RequestLeave = ({ drawer, data, navigation }) => {
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

  const handleBack = () => {
    navigation.navigate("QRScan");
  };

  const handleSubmit = async () => {
    setError({});
    let isValid = true;
    let newErrors = {};

    if (!staffId.trim()) {
      newErrors.staffId = "Staff ID is required";
      isValid = false;
    }

    if (!staffName.trim()) {
      newErrors.staffName = "Staff name is required";
      isValid = false;
    }

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

      const leaveRequestRef = collection(DB, "LeaveRequests");
      await addDoc(leaveRequestRef, {
        staffId,
        staffName,
        leaveType,
        reason,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "Pending",
      });

      setStaffId("");
      setStaffName("");
      setLeaveType("Short Leave");
      setReason("");
      setStartDate(new Date());
      setEndDate(new Date());

      navigation.navigate("Success");
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setLoading(false);
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
            value={staffId}
            onChangeText={setStaffId}
          />
          {error.staffId && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.staffId}</Text>
            </Animated.View>
          )}

          <Text style={styles.label}>Staff Name:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Staff Name"
            value={staffName}
            onChangeText={setStaffName}
          />
          {error.staffName && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.staffName}</Text>
            </Animated.View>
          )}
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
            <Text>{startDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="datetime"
              display={Platform.OS === "android" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowStartDatePicker(false); // Hide the picker
                if (date) {
                  setStartDate(date); // Set the date only if it's not null
                }
              }}
            />
          )}

          <Text style={styles.label}>End Date and Time:</Text>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.inputBox}
          >
            <Text>{endDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="datetime"
              display={Platform.OS === "android" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowEndDatePicker(false); // Hide the picker
                if (date) {
                  setEndDate(date); // Set the date only if it's not null
                }
              }}
            />
          )}
        </ScrollView>

        {/* Submit Button (fixed at the bottom) */}
        <View style={styles.ButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Request Leave</Text>
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
    backgroundColor: colors.primary,
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
    color: colors.primary,
  },
  inputBox: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 5,
  },
  pickerContainer: {
    marginHorizontal: 20,
    borderColor: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 10,
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
