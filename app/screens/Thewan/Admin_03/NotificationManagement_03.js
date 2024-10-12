import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../../Utils/colors';
import { collection, query, where, getDocs } from 'firebase/firestore';  // Import Firestore methods
import { DB } from '../../../config/DB_config';
import MenuButton from '../../../Components/MenuButton';

const { width, height } = Dimensions.get('window');

function TeamIdWorkLog_03({ navigation, drawer, data }) {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);

    // Fetch Notifications for the user
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const q = query(collection(DB, 'Notifications'), where('userEmail', '==', data.data.email));
                const querySnapshot = await getDocs(q);
                const notificationsData = [];
                querySnapshot.forEach((doc) => {
                    notificationsData.push({ id: doc.id, ...doc.data() });
                });
                setNotifications(notificationsData);
                setFilteredNotifications(notificationsData);  // Initially set filtered to all notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setGeneralError('Failed to load notifications. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [data.data.email]);

    // Search function for filtering notifications
    const handleSearch = (text) => {
        setSearchQuery(text);
        const filteredData = notifications.filter(
            (item) => item.message.toLowerCase().includes(text.toLowerCase()) ||
                item.userEmail.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredNotifications(filteredData);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.loadingText}>Processing</Text>
                </View>
            ) : (
                <>
                    <View style={styles.TopBarContainer}>
                        <Text style={styles.TopBar}>      Notifications</Text>
                    </View>
                    <View style={styles.formbackground}>
                        <View style={styles.formContainer}>
                            <View style={styles.headerlistContainer}>
                                <MenuButton color={colors.Button1} onPress={() => drawer.current.openDrawer()} />
                                <View style={styles.searchContainer}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search Notifications..."
                                        placeholderTextColor={colors.subitm}
                                        value={searchQuery}
                                        onChangeText={handleSearch}
                                    />
                                </View>
                            </View>
                            <ScrollView style={styles.scrollViewContainer}>
                                <View style={styles.ListContainer}>
                                    {filteredNotifications.length === 0 ? (
                                        <Text style={styles.noNotificationsText}>No Notifications Found</Text>
                                    ) : (
                                        filteredNotifications.map((notification) => (
                                            <View key={notification.id} style={styles.notificationItem}>
                                                <Text style={styles.notificationTitle}>{notification.message}</Text>
                                                <Text style={styles.notificationDate}>
                                                {new Date(notification.time.seconds ).toLocaleString()}
                                                </Text>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.backgroundcolor1,
    },
    TopBarContainer: {
        width: '90%',
        justifyContent: "center",
        alignItems:"flex-end",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3: 70,
    },
    TopBar: {
        fontSize: 42,
        color: colors.backgroundcolor2,
        fontWeight: 'bold',
        alignItems:"flex-end",
    },
    formContainer: {
        paddingHorizontal: 20,
        width: '95%',
        alignSelf: 'center',
    },
    formbackground: {
        backgroundColor: colors.backgroundcolor2,
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        height: 1000,
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 0.05 : 30,
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerlistContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    searchContainer: {
        paddingHorizontal: 10,
        marginTop: 30,
        width: '85%',
    },
    searchInput: {
        padding: 10,
        borderRadius: 40,
        color: colors.Button1,
        fontSize: 18,
        width: '100%',
        borderColor: colors.Button1,
        borderWidth: 2,
    },
    scrollViewContainer: {
        width: '100%',
        padding: 5,
        marginBottom: height * 0.15,
        marginTop: 20,
        backgroundColor: colors.backgroundcolor2,
    },
    ListContainer: {},
    notificationItem: {
        backgroundColor: '#99ccff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
    },
    notificationDate: {
        fontSize: 14,
        color: colors.subitm,
        marginTop: 5,
    },
    noNotificationsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: colors.black,
    }
});

export default TeamIdWorkLog_03;
