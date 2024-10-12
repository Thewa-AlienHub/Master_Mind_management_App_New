import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions, TextInput, ScrollView, ActivityIndicator, Alert, Button, Modal } from 'react-native';
import colors from '../../../Utils/colors';
import { collection, query, getDocs, setDoc, doc,where ,addDoc} from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import MenuButton from '../../../Components/MenuButton';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

function AmenityBookingList_03({ navigation, drawer ,data}) {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [AmenityList, setAmenityList] = useState([]);
    const [selectedCardIds, setSelectedCardIds] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);  
    const [selectedTeam, setSelectedTeam] = useState('');     

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchReportedLists();
            } catch (error) {
                console.error('Failed to fetch reported lists:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const fetchReportedLists = async () => {
        const AmenityListRef = collection(DB, 'Reservation');
        const q1 = query(AmenityListRef, where('Status', '==', 'Pending'));
        
        try {
            const snapshot1 = await getDocs(q1);
            const fetchedData = {};
        
            snapshot1.forEach((doc) => {
                fetchedData[doc.id] = { id: doc.id, ...doc.data() };
            });
        
            const pendingItems = Object.values(fetchedData);
            setAmenityList(pendingItems); 
        
            console.log('Merged Amenity List Data:', pendingItems);
        } catch (error) {
            console.error('Error fetching data Amenity List Data:', error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    
        if (Array.isArray(AmenityList)) {
            if (text.trim() === '') {
                fetchReportedLists(); 
            } else {
                const filteredData = AmenityList.filter(
                    (item) => {
                        const itemName = item.Name ? item.Name.toString().toLowerCase() : '';
                        return itemName.includes(text.toLowerCase());
                    }
                );
                setAmenityList(filteredData);
            }
        }
    };

    const toggleCardSelection = (id) => {
        setSelectedCardIds(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(selectedId => selectedId !== id);
            }
            return [...prevSelected, id];
        });
    };

    const handleAssign = () => {
        if (selectedCardIds.length === 0) {
            Alert.alert("No reservations selected", "Please select at least one reservation to assign.");
            return;
        }

        setModalVisible(true); 
    };

    const handleTeamSubmit = async () => {
        if (!selectedTeam) {
            Alert.alert("No team selected", "Please select a team before submitting.");
            return;
        }
    
        try {
            // Loop over selectedCardIds to fetch and assign the respective reservations
            for (const id of selectedCardIds) {
                const selectedAmenity = AmenityList.find(item => item.id === id);
                if (selectedAmenity) {
                    // Assign to 'assignedList' collection
                    await setDoc(doc(DB, 'assignedList', id), {
                        amenityId: selectedAmenity.amenityId,  // amenityId
                        userEmail: selectedAmenity.userEmail || 'unknown@example.com',  // userEmail from the selected reservation
                        date: new Date(),
                        team: selectedTeam,  // the selected team
                    });
    
                    // Insert a notification into 'notifications' collection
                    await addDoc(collection(DB, 'notifications'), {
                        createdEmail: data.data.email || 'unknown@example.com',
                        userEmail: selectedAmenity.userEmail || '',
                        message: `Successfully for amenity ${selectedAmenity.amenityId} has been assigned to team ${selectedTeam}.`,
                        timestamp: new Date(),  // Time of notification
                        date: new Date().toLocaleDateString(),  // Format: MM/DD/YYYY or based on locale
                        time: new Date().toLocaleTimeString(),  // Format: HH:MM AM/PM or 24hr based on locale
                    });
                }
            }
    
            setSelectedCardIds([]);  // Clear selection
            setModalVisible(false);
            navigation.navigate('SuccessScreen_03', {
                drawer: { drawer },
                data: { data },
                navigation: { navigation }
            });  // Hide modal and navigate
        } catch (error) {
            console.error("Error during assignment:", error);
            Alert.alert("Assignment Failed", "There was an error assigning the reservations.");
        }
    };
    
    

    const renderAmenityCard = (item) => {
        const isSelected = selectedCardIds.includes(item.id); 
    
        return (
            <TouchableOpacity
            key={item.id}
            style={[styles.card, isSelected ? { backgroundColor: colors.backgroundcolor1 } : null]}
            onPress={() => toggleCardSelection(item.id)} 
        >
            <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{item.amenityId}</Text>
                <View style={styles.verticalLine} />
            </View>
            <Text style={styles.cardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>Date:  </Text> {format(new Date(item.reservationDate), 'MM/dd/yyyy')}
            </Text>
            <Text style={styles.cardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>Time:  </Text> {item.reservationTime}
            </Text>
            <Text style={styles.cardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>Duration:  </Text> {item.duration} hours
            </Text>
            <Text style={styles.cardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>Participants:  </Text> {item.noOfParticipants}
            </Text>
            <Text style={styles.cardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>More Info:  </Text> {item.moreInfo}
            </Text>
        </TouchableOpacity>
        

        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.loadingText}>Processing ....</Text>
                </View>
            ) : (
                <>
                    <View style={styles.TopBarContainer}>
                        <Text style={styles.TopBar}> Amenity{'\n'}Booking List</Text>
                    </View>
                    <View style={styles.formbackground}>
                        <View style={styles.formContainer}>
                            <View style={styles.headerlistContainer}>
                                <MenuButton color={colors.Button1} onPress={() => drawer.current.openDrawer()} />
                                <View style={styles.searchContainer}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search Bookings..."
                                        placeholderTextColor={colors.subitm}
                                        value={searchQuery}
                                        onChangeText={handleSearch}
                                    />
                                </View>
                            </View>
                            {generalError !== '' && (
                                <Text style={styles.errorText}>{generalError}</Text>
                            )}
                            <ScrollView style={styles.scrollViewContainer}>
                                <View style={styles.ListContainer}>
                                    {AmenityList.map(renderAmenityCard)}
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
                                <Text style={styles.assignButtonText}>Assign Team</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Team Selection Modal */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Team</Text>
                                <Picker
                                    selectedValue={selectedTeam}
                                    onValueChange={(itemValue) => setSelectedTeam(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select a team" value="" />
                                    <Picker.Item label="Team A" value="Team A" />
                                    <Picker.Item label="Team B" value="Team B" />
                                    <Picker.Item label="Team C" value="Team C" />
                                </Picker>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.submitButton} onPress={handleTeamSubmit}>
                                        <Text style={styles.submitButtonText}>Submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.submitButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            
                        </View>
                    </Modal>
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
        alignItems: "flex-end",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1 : 70,
    },
    TopBar: {
        fontSize: 42,
        color: colors.backgroundcolor2,
        fontWeight: 'bold',
        alignItems: "flex-end",
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
        padding: 10,
       
    },
    ListContainer: {
        paddingTop: 10,
        alignItems: 'center',
    },
    card: {
        backgroundColor: "#99ccff",
        padding: 20,
        borderRadius: 30,
        marginVertical: 5,
        width: '100%',
        alignItems: 'flex-start',
        marginHorizontal: 5,
        
    },
    availableCard: {
        backgroundColor: colors.green,
    },
    unavailableCard: {
        backgroundColor: colors.red,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 16,
    },
    assignButton: {
        backgroundColor: colors.Button1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 1,
    },
    assignButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    submitButton: {
        backgroundColor: colors.Button1,
        padding: 10,
        borderRadius: 10,
        marginTop: 30,
    },
    cancelButton:{
        backgroundColor: colors.red,
        padding: 10,
        borderRadius: 10,
        marginTop: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',  // Center align items vertically
    },
    verticalLine: {
        width: '100%',             // Width of the vertical line
        height: 2,       // Make it occupy the full height of the title container
        backgroundColor: 'gray', // Line color
        marginLeft: 10,       // Space between title and line
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',   // Make the title bold
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distributes space between buttons
        marginTop: 20, // Optional: Add some margin to separate from above content
    },

});

export default AmenityBookingList_03;
