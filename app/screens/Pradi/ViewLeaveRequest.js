import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import MenuButton from "../../Components/MenuButton";
import colors from "../../Utils/colors";
import { DB } from "../../config/DB_config";

const ViewLeaveRequest = ({ drawer, data, navigation }) => {
  const [scanData, setScanData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const email = data.data.email;

  useEffect(() => {
    const dataRef = collection(DB, "LeaveRequests");

    const unsubscribe = onSnapshot(
      dataRef,
      (snapshot) => {
        const fetchedData = [];
        snapshot.forEach((doc) => {
          if (doc.id.startsWith(email)) {
            const data = doc.data();
            const {
              leaveType,
              reason,
              startDate,
              endDate,
              status,
              RequestDate,
            } = data;

            const requestDate =
              RequestDate && RequestDate.seconds
                ? new Date(RequestDate.seconds * 1000)
                : null;

            if (requestDate) {
              fetchedData.push({
                id: doc.id,
                leaveType,
                reason,
                startDate,
                endDate,
                status,
                RequestDate: requestDate,
              });
            }
          }
        });

        const sortedData = fetchedData.sort(
          (a, b) => new Date(a.RequestDate) - new Date(b.RequestDate)
        );

        setScanData(sortedData);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [email]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return colors.brown;
      case "Approved":
        return colors.green;
      case "Declined":
        return colors.red;
      default:
        return colors.black;
    }
  };

  const handleEdit = (item) => {
    // Navigate to the 'RequestLeave' form with the current item data.
    navigation.navigate("RequestLeave", { leaveRequest: item });
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this leave request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteDoc(doc(DB, "LeaveRequests", item.id));
              Alert.alert("Success", "Leave request deleted successfully!");
            } catch (error) {
              console.error("Error deleting leave request: ", error);
              Alert.alert("Error", "Failed to delete the leave request.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>Leave Type: {item.leaveType}</Text>
        <Text style={styles.itemSubtitle}>Reason: {item.reason}</Text>
        <Text style={styles.itemSubtitle}>
          Start Date: {new Date(item.startDate).toLocaleString()}
        </Text>
        <Text style={styles.itemSubtitle}>
          End Date: {new Date(item.endDate).toLocaleString()}
        </Text>
        <Text style={styles.itemSubtitle}>
          Requested Date:{" "}
          {item.RequestDate ? item.RequestDate.toLocaleString() : "N/A"}
        </Text>
        <Text
          style={[styles.itemMiddle, { color: getStatusColor(item.status) }]}
        >
          Status: {item.status}
        </Text>
        {/* Conditionally render action buttons */}
        <View style={styles.rectangleBtnContainer}>
          <View style={styles.actionButtonsContainer}>
            {item.status === "Pending" && (
              <TouchableOpacity
                style={[styles.editButton, styles.activeTab]} // Set activeTab style here
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionButtonTextE}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton} // Set activeTab style here
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.actionButtonTextD}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const filterDataByStatus = () => {
    if (selectedStatus === "All") {
      return scanData;
    }
    return scanData.filter((item) => item.status === selectedStatus);
  };

  const filteredData = filterDataByStatus();

  const getToggleTextColor = (status, isActive) => {
    if (isActive) return colors.black; // Active text color

    switch (status) {
      case "Approved":
        return colors.green;
      case "Declined":
        return colors.red;
      case "Pending":
        return colors.brown;
      default:
        return colors.black; // Default color for "All" or other statuses
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
      <Text style={styles.headerText1}>Leave</Text>
      <Text style={styles.headerText2}>Requests</Text>

      <View style={styles.TopBarContainer}>
        <View style={styles.rectangleContainer}>
          <View style={styles.toggleContainer}>
            {["All", "Approved", "Declined", "Pending"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.toggleButton,
                  selectedStatus === status && styles.activeToggleButton,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    {
                      color: getToggleTextColor(
                        status,
                        selectedStatus === status
                      ),
                    },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {filteredData.length === 0 ? (
          <Text>No leave records found for the selected filter.</Text>
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
  rectangleContainer: {
    backgroundColor: colors.listBg,
    marginVertical: 20,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    height: 60,
    zIndex: 0,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemMiddle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginHorizontal: 100,
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
  toggleContainer: {
    flexDirection: "row",
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  activeToggleButton: {
    backgroundColor: colors.white,
  },
  toggleButtonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  editButton: {
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  deleteButton: {
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  actionButtonTextE: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },

  actionButtonTextD: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  rectangleBtnContainer: {
    backgroundColor: colors.Button1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    marginHorizontal: 70,
    height: 50,
    zIndex: 0,
  },
});

export default ViewLeaveRequest;
