import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, StatusBar, Dimensions, TextInput } from 'react-native';
import colors from '../../../Utils/colors';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { DB } from '../../../config/DB_config'; // Your Firestore config
import MenuButton from './../../../Components/MenuButton';

const { height } = Dimensions.get('window'); // Get device height

function ReservationList_03({ navigation, route, data, drawer }) {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const q = query(collection(DB, 'Reservation'), where('userEmail', '==', data.data.email));
                const querySnapshot = await getDocs(q);
                const reservationsData = [];
                querySnapshot.forEach((doc) => {
                    reservationsData.push({ id: doc.id, ...doc.data() }); // Keep data as an object
                });
                setReservations(reservationsData);
            } catch (error) {
                Alert.alert("Error fetching reservations", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [data.data.email]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(DB, 'Reservation', id));
            setReservations(reservations.filter(reservation => reservation.id !== id));
            navigation.navigate('SuccessScreen_03delete', {
                drawer: { drawer },
                data: { data },
                navigation: { navigation }
            });
        } catch (error) {
            Alert.alert("Error deleting reservation", error.message);
        }
    };

    const handleEdit = (reservation) => {
        navigation.navigate('EditReservation_03', { reservation, data: data, drawer: drawer, navigation: navigation });
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter reservations based on search query
    const filteredReservations = reservations.filter((reservation) => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            reservation.userEmail.toLowerCase().includes(lowercasedQuery) ||
            reservation.contactInfo.toLowerCase().includes(lowercasedQuery) ||
            reservation.amenityId.toLowerCase().includes(lowercasedQuery) ||
            reservation.reservationDate.toLowerCase().includes(lowercasedQuery) ||
            reservation.reservationTime.toLowerCase().includes(lowercasedQuery)
        );
    });

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading Reservations...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.TopBarContainer}>
                        <Text style={styles.TopBar}>             Your{'\n'}Reservations</Text>
                    </View>

                    <View style={styles.listContainer1}>
                        <View style={styles.headerlistContainer}>
                            <MenuButton color={colors.Button1} onPress={() => drawer.current.openDrawer()} />
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search Bookings..."
                                    placeholderTextColor={colors.subitm}
                                    value={searchQuery}
                                    onChangeText={handleSearch} // Update search query
                                />
                            </View>
                        </View>
                        <ScrollView style={styles.listContainer}>
                            {filteredReservations.length === 0 ? (
                                <View>
                                    <Text style={styles.noReservationsText}>No Reservations Found</Text>
                                </View>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <View key={reservation.id} style={styles.reservationItem}>
                                        {/* User Email displayed without a label in bold */}
                                        <Text style={styles.userEmail}>{String(reservation.userEmail) || 'No Email'}</Text>
                                        <View style={styles.horizontalLine} /> 
                                        <Text style={styles.itemlabel}>Amenity ID:</Text>
                                        <Text>{String(reservation.amenityId) || 'N/A'}</Text>
                                        <Text style={styles.itemlabel}>Contact Info:</Text>
                                        <Text>{String(reservation.contactInfo) || 'No Contact Info'}</Text>
                                        <Text style={styles.itemlabel}>Duration:</Text>
                                        <Text>{String(reservation.duration) || 'No Duration'}</Text>
                                        <Text style={styles.itemlabel}>Additional Info:</Text>
                                        <Text>{String(reservation.moreInfo) || 'No Additional Info'}</Text>
                                        <Text style={styles.itemlabel}>Participants:</Text>
                                        <Text>{String(reservation.noOfParticipants) || 'No Participants'}</Text>
                                        <Text style={styles.itemlabel}>Reservation Date:</Text>
                                        <Text>{String(reservation.reservationDate) || 'No Date'}</Text>
                                        <Text style={styles.itemlabel}>Reservation Time:</Text>
                                        <Text>{String(reservation.reservationTime) || 'No Time'}</Text>
                                        
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={styles.editButton}
                                                onPress={() => handleEdit(reservation)}
                                            >
                                                <Text style={styles.buttonText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDelete(reservation.id)}
                                            >
                                                <Text style={styles.buttonText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundcolor1,
    },
    TopBarContainer: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1.7 : 70,
    },
    TopBar: {
        fontSize: 42,
        color: colors.white,
        fontWeight: 'bold',
        alignItems: "flex-end",
    },
    listContainer1: {
        backgroundColor: colors.backgroundcolor2,
        width: '100%',
        alignSelf: 'center',
        height: height * 0.9,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    reservationItem: {
        backgroundColor: colors.backgroundcolor1,
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: colors.Button1,
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noReservationsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: colors.black,
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
    userEmail: {
        fontWeight: 'bold', // Make user email bold
        fontSize: 16, // Adjust font size as needed
        marginBottom: 5, // Space below the email
    },
    horizontalLine: {
        height: 2,
        backgroundColor: colors.Button1, // Change this to your desired color
        marginBottom: 10, // Space below the line
    },
    itemlabel: {
        fontWeight: 'bold', // Bold for labels
        fontSize: 14, // Adjust font size as needed
        color: colors.black, // Change color if needed
    },
});

export default ReservationList_03;
