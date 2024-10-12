import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform, StatusBar, Dimensions } from 'react-native';
import colors from '../../../Utils/colors';
import { collection, doc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../../config/DB_config'; // Your Firestore config
import DateTimePicker from '@react-native-community/datetimepicker';

const { height } = Dimensions.get('window'); // Get device height

function EditReservation_03({ navigation, route, data ,drawer}) {
    const { reservation } = route.params; // Get the passed reservation object
    const userEmail = data.data.email;
    console.log("Reservation:", reservation); // Retrieve user's email

    // State variables for form fields initialized with existing values
    const [contactInfo, setContactInfo] = useState(reservation.contactInfo);
    const [reservationDate, setReservationDate] = useState(reservation.reservationDate);
    const [reservationTime, setReservationTime] = useState(reservation.reservationTime);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [duration, setDuration] = useState(reservation.duration);
    const [noOfParticipants, setNoOfParticipants] = useState(reservation.noOfParticipants);
    const [moreInfo, setMoreInfo] = useState(reservation.moreInfo);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Update the reservation document in the Firestore
            const reservationRef = doc(DB, 'Reservation', userEmail);
            await updateDoc(reservationRef, {
                Status: 'Pending', // You may want to keep this or change based on your needs
                contactInfo,
                reservationDate,
                reservationTime,
                duration,
                noOfParticipants:reservation.noOfParticipants,
                moreInfo,
            });

            // Navigate to success screen or wherever needed
            navigation.navigate('SuccessScreen02_03edit', {
                data: { data },
                navigation: { navigation },
                drawer:{drawer}
            });
        } catch (error) {
            Alert.alert("Error", "There was an issue updating your reservation.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setReservationDate(currentDate);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false); // Close the time picker after selection
        if (selectedTime) {
            // Convert selected time to a readable format
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            setReservationTime(formattedTime); // Update reservation time state
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.loadingText}>Processing Reservation...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.TopBarContainer}>
                        <Text style={styles.TopBar}>Edit{'\n'}Reservation</Text>
                    </View>
                    <View style={styles.listContainer}>
                        <ScrollView style={styles.formContainer}>
                            <Text style={styles.label}>Contact Information</Text>
                            <TextInput
                                style={styles.input}
                                value={contactInfo}
                                onChangeText={setContactInfo}
                                placeholder="Enter your contact information"
                            />

                            <Text style={styles.label}>Reservation Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                <Text>{reservationDate ? reservationDate : 'Select Date'}</Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date(reservationDate)}
                                    mode="date"
                                    display="calendar"
                                    onChange={onDateChange}
                                    themeVariant="dark"
                                />
                            )}

                            <Text style={styles.label}>Reservation Time</Text>
                            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                                <Text>{reservationTime ? reservationTime : 'Select time'}</Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={new Date(`1970-01-01T${reservationTime}`)} // Time only for DateTimePicker
                                    mode="time"
                                    display="default"
                                    onChange={handleTimeChange}
                                    themeVariant="dark"
                                />
                            )}

                            <Text style={styles.label}>Duration (in hours)</Text>
                            <TextInput
                                style={styles.input}
                                value={duration}
                                onChangeText={setDuration}
                                placeholder="Enter duration"
                            />

                           

                            <Text style={styles.label}>More Information</Text>
                            <TextInput
                                style={styles.input}
                                value={moreInfo}
                                onChangeText={setMoreInfo}
                                placeholder="Enter additional information"
                            />

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Submit Reservation</Text>
                            </TouchableOpacity>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1.7: 70,
    },
    TopBar: {
        fontSize: 42,
        color: colors.white,
        fontWeight: 'bold',
        alignItems:"flex-end",
    },
    listContainer:{
        backgroundColor:colors.backgroundcolor2,
        width:'100%',
        alignSelf:'center',
        height:height*0.9,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
        marginTop:10,
       
        paddingHorizontal:20,
  },
    maincontainer:{
        backgroundColor: colors.backgroundcolor2,
        margin: 20,
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
    formContainer: {
        flex: 1,
        marginBottom: 80,
        marginTop: 30,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: colors.black,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.Button1,
        borderRadius: 20,
        padding: 10,
        marginVertical: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
    },
    submitButton: {
        backgroundColor: colors.Button1,
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        width: '70%',
        marginHorizontal: '15%',
        
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EditReservation_03;
