import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import Firestore methods
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { parseISO, compareDesc } from "date-fns";
import MenuButton from "../../Components/MenuButton";
import colors from "../../Utils/colors";
import { DB } from "../../config/DB_config"; // Import your Firestore DB config

const ViewAttendance = ({ drawer, navigation, data }) => {
  const [selectedTab, setSelectedTab] = useState("Today");
  const [scanData, setScanData] = useState([]);
  const email = data.data.email;

  useEffect(() => {
    const dataRef = collection(DB, "attendance"); // Reference to your attendance collection
    const userAttendanceQuery = query(
      dataRef,
      where("email", "==", email) // Query for logged-in user's attendance
    );

    const unsubscribe = onSnapshot(userAttendanceQuery, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched Data Before Sorting:", fetchedData); // Debug log

      // Sort the fetched data by date in descending order (latest first)
      const sortedData = fetchedData.sort((a, b) => {
        const dateA = new Date(a.dateAndTime);
        const dateB = new Date(b.dateAndTime);
        return compareDesc(dateA, dateB);
      });

      setScanData(sortedData);
    });

    return () => unsubscribe();
  }, [email]); // Add email as a dependency

  const handleViewReport = (item) => {
    navigation.navigate("ReportView", { report: item });
  };

  const handleDownloadAll = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to save files."
        );
        return;
      }

      const htmlContent = scanData
        .map(
          (item) => `
          <h1>${item.houseAddress}</h1>
          <p>Location: ${item.ownerNam}</p>
          <p>Date: ${item.readableDate}</p>
          <hr/>
        `
        )
        .join("");

      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("PDF file created at:", pdfUri); // Debugging log to verify the file path

      // Save and share the PDF file as in your original code...
    } catch (error) {
      console.error("Error creating or sharing PDF:", error);
      Alert.alert("Error", "Failed to download the PDF. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Image
        source={require("../../assets/Pradi/file-icon.png")}
        style={styles.fileIcon}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.location}</Text>
        <Text style={styles.itemSubtitle}>{item.readableDate}</Text>
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => handleViewReport(item)}>
          <Image
            source={require("../../assets/Pradi/view-icon.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menubtn}>
        <MenuButton
          color={colors.white}
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanning History</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Today" && styles.selectedTab]}
          onPress={() => setSelectedTab("Today")}
        >
          <Text style={styles.tabText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "All" && styles.selectedTab]}
          onPress={() => setSelectedTab("All")}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadAllButton}
          onPress={handleDownloadAll}
        >
          <Text style={styles.downloadAllButtonText}>Download All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={scanData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    marginTop: 70,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00CE5E",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#6EC6B2",
    marginHorizontal: 5,
  },
  selectedTab: {
    backgroundColor: "#00CE5E",
  },
  tabText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  list: {
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F4F4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#ffffff",
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 90,
  },
  actionIcon: {
    width: 40,
    height: 40,
  },
  downloadAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#00CE5E",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadAllButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  menubtn: {
    marginTop: 40,
    marginLeft: 10,
    position: "absolute",
  },
});

export default ViewAttendance;
