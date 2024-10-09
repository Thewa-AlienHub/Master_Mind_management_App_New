import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import MenuButton from "../../Components/MenuButton";
import colors from "../../Utils/colors";
import { DB } from "../../config/DB_config";
import DateTimePicker from "@react-native-community/datetimepicker";

const ViewAttendance = ({ drawer, data }) => {
  const [scanData, setScanData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const email = data.data.email;
  const timerRef = useRef();

  useEffect(() => {
    console.log("Current selected date:", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const dataRef = collection(DB, "attendance");

    const unsubscribe = onSnapshot(dataRef, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((doc) => {
        if (doc.id.startsWith(email)) {
          const data = doc.data();
          const checkInTime = data.checkInTime?.toDate
            ? data.checkInTime.toDate()
            : new Date(data.checkInTime);
          const checkOutTime = data.checkOutTime?.toDate
            ? data.checkOutTime.toDate()
            : null;

          const formattedDate = checkInTime.toLocaleDateString("en-GB");
          const formattedCheckInTime = checkInTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const formattedCheckOutTime = checkOutTime
            ? checkOutTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "--:--:--";

          // Calculate total worked hours
          let totalWorkedMilliseconds = checkOutTime
            ? checkOutTime.getTime() - checkInTime.getTime()
            : Date.now() - checkInTime.getTime();

          const totalWorkedSeconds = Math.floor(totalWorkedMilliseconds / 1000);
          const totalWorkedHours = Math.floor(totalWorkedSeconds / 3600);
          const totalWorkedMinutes = Math.floor(
            (totalWorkedSeconds % 3600) / 60
          );
          const totalWorkedRemainingSeconds = totalWorkedSeconds % 60;

          const formattedTotalWorkedHours = `${totalWorkedHours}h ${totalWorkedMinutes}min ${totalWorkedRemainingSeconds}s`;

          fetchedData.push({
            id: doc.id,
            ...data,
            date: formattedDate,
            checkInTime: formattedCheckInTime,
            checkOutTime: formattedCheckOutTime,
            totalWorkedHours: formattedTotalWorkedHours,
            checkInTimestamp: checkInTime,
            isCheckedOut: checkOutTime === null,
          });
        }
      });

      const sortedData = fetchedData.sort(
        (a, b) => b.checkInTimestamp - a.checkInTimestamp
      );
      setScanData(sortedData); // Set all fetched data
    });

    return () => {
      unsubscribe();
      clearInterval(timerRef.current);
    };
  }, [email]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setScanData((prevData) => {
        return prevData.map((item) => {
          // Only update for items that are not checked out
          if (item.isCheckedOut) {
            const totalWorkedMilliseconds =
              Date.now() - item.checkInTimestamp.getTime();
            const totalWorkedSeconds = Math.floor(
              totalWorkedMilliseconds / 1000
            );
            const totalWorkedHours = Math.floor(totalWorkedSeconds / 3600);
            const totalWorkedMinutes = Math.floor(
              (totalWorkedSeconds % 3600) / 60
            );
            const totalWorkedRemainingSeconds = totalWorkedSeconds % 60;

            // Update the total worked hours
            const formattedTotalWorkedHours = `${totalWorkedHours}h ${totalWorkedMinutes}min ${totalWorkedRemainingSeconds}s`;

            return {
              ...item,
              totalWorkedHours: formattedTotalWorkedHours,
            };
          }

          return item; // If checked out, return item without changes
        });
      });
    }, 1000); // Update every second

    return () => clearInterval(timerRef.current); // Cleanup the interval on unmount
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>Date: {item.date}</Text>
        <Text style={styles.itemSubtitle}>Check-In: {item.checkInTime}</Text>
        <Text style={styles.itemSubtitle}>Check-Out: {item.checkOutTime}</Text>
        <Text style={styles.itemSubtitle}>
          Total Worked Hours: {item.totalWorkedHours}
        </Text>
      </View>
    </View>
  );

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    console.log("Event Type: ", event.type);
    console.log("Selected Date: ", date);

    if (event.type === "set" && date) {
      setSelectedDate(date); // Set the selected date
      console.log("Updated Selected Date: ", date);
    }

    setShowDatePicker(false); // Always close the date picker after selection
  };

  const removeFilter = () => {
    setSelectedDate(null); // Reset the selected date
  };

  // Determine which data to display
  const filteredData = selectedDate
    ? scanData.filter(
        (item) => item.date === selectedDate.toLocaleDateString("en-GB")
      ) // Filter by selected date
    : scanData; // Show all records if no date selected

  return (
    <View style={styles.container}>
      <View style={styles.menubtn}>
        <MenuButton
          color={colors.white}
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
      <Text style={styles.headerText1}>Attendance</Text>
      <Text style={styles.headerText2}>History</Text>

      <View style={styles.TopBarContainer}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={showPicker}>
            <Text style={styles.buttonText}>Filter By Date</Text>
          </TouchableOpacity>

          {/* New Remove Filter Button */}
          <TouchableOpacity style={styles.removeButton} onPress={removeFilter}>
            <Text style={styles.removeButtonText}>Remove Filter</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {filteredData.length === 0 ? (
          <Text>No attendance records found for the selected date.</Text>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  list: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    backgroundColor: colors.listBg,
    borderRadius: 30,
    paddingVertical: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  menubtn: {
    marginTop: 40,
    marginLeft: 10,
    position: "absolute",
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
    flex: 1,
    paddingTop: 10,
    marginTop: 170,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    marginLeft: 60,
    marginRight: 60,
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  removeButton: {
    backgroundColor: colors.secondary, // Set the button color to secondary
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  removeButtonText: {
    color: colors.black, // Set the text color to black
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonText: {
    color: colors.black, // Text color for button
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ViewAttendance;
