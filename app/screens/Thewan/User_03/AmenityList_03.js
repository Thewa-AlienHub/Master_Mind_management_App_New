import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions, TextInput, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import colors from '../../../Utils/colors';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import MenuButton from '../../../Components/MenuButton';

const { width, height } = Dimensions.get('window');

function AmenityList_03({ navigation, drawer, data }) {

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [AmenityList, setAmenityList] = useState([]);

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
        const AmenityListRef = collection(DB, 'AmenityList');

        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        const sevenDaysAgoTimestamp = sevenDaysAgo.getTime();

        const q1 = query(AmenityListRef);

        try {
            const snapshot1 = await getDocs(q1);
            console.log('Snapshot1 size:', snapshot1.size);

            const fetchedData = {};

            snapshot1.forEach((doc) => {
                fetchedData[doc.id] = { id: doc.id, ...doc.data() };
            });

            const pendingItems = Object.values(fetchedData);
            setAmenityList(Object.values(pendingItems));

            console.log('Merged Amenity List Data:', Array.from(fetchedData));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data Amenity List Data:', error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    
        if (Array.isArray(AmenityList)) {
            // If text is empty, reset to the full list
            if (text.trim() === '') {
                fetchReportedLists(); // Reset the list by re-fetching data
            } else {
                const filteredData = AmenityList.filter(
                    (item) => {
                        // Check if item.Name exists and includes the search query
                        const itemName = item.Name ? item.Name.toString().toLowerCase() : '';
                        // Check availability
                        const itemAvailability = item.Availability !== undefined ? item.Availability : '';
    
                        // Return true if item matches the search text or has relevant availability
                        return itemName.includes(text.toLowerCase()) || itemAvailability.toString().toLowerCase().includes(text.toLowerCase());
                    }
                );
                setAmenityList(filteredData);
            }
        }
    };
    
    

    const handleCardPress = (item) => {
        if (item.Availability === false) {
            setGeneralError('The selected amenity is unavailable.');
            Alert.alert('Unavailable', 'The selected amenity is unavailable.');
        } else {
            navigation.navigate('MakeReservation_03', { amenityId: item.id ,data: data });
        }
    };

    const renderAmenityCard = (item) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.card,
                    item.Availability === false ? styles.unavailableCard : styles.availableCard
                ]}
                onPress={() => handleCardPress(item)}
                disabled={item.Availability === false}
            >
                {/* Display the image */}
                {item.imageURL && (
                    <Image
                    source={{ uri: item.imageURL }} 
                    style={styles.cardImage}
                    resizeMode="cover"
                    onError={(error) => {
                        console.error('Image load error:', error);
                        // Optionally set a default image or state for error
                    }}
                />
                )}
                <Text style={styles.cardTitle}>{item.Name}</Text>
                <Text style={[
                    styles.cardSubtitle,
                    item.Availability === false ? styles.unavailableText : styles.availableText
                ]}>
                    {item.Availability === false ? 'Unavailable' : 'Available'}
                </Text>
                
                
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.backgroundcolor1} />
                    <Text style={styles.loadingText}>Processing...</Text>
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
        marginBottom: height * 0.22,
        
    },
    ListContainer: {
        paddingTop: 10,
    },
    card: {
        padding: 15,
        borderRadius: 30,
        marginBottom: 15,
        backgroundColor: colors.lightBlue,
        elevation: 4,
    },
    availableCard: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    unavailableCard: {
        borderColor: 'red',
        borderWidth: 2,
        backgroundColor:colors.light,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 16,
        color: colors.subitm,
        marginTop: 5,
        fontWeight: 'bold',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    unavailableText: {
        color: 'red', // Set text color to red
    },
    availableText: {
        color: 'green', // Set text color to green
    },
});

export default AmenityList_03;
