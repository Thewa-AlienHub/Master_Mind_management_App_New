import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../../Utils/colors';
import { useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../../config/DB_config';
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

function ViewIssueSimpleAdmin({ route, navigation }) {

    const { documentId, collectionName, email } = route.params;
    const [currentIssue, setCurrentIssue] = useState();
    const [loading, setLoading] = useState(false);  // Loading for delete action
    const [fetchLoading, setFetchLoading] = useState(true);  // Loading for fetching data

    // Fetch updated issue details from Firestore
    const fetchUpdatedIssue = async () => {
        setFetchLoading(true);  // Start fetch loading
        try {
            const issueRef = doc(DB, collectionName, documentId);
            const docSnap = await getDoc(issueRef);

            if (docSnap.exists()) {
                setCurrentIssue(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        } finally {
            setFetchLoading(false);  // End fetch loading
        }
    };

    // Delete the issue from Firestore
    const deleteIssue = async () => {
        setLoading(true);  // Start delete loading
        const issueRef = doc(DB, collectionName, documentId);
        try {
            await deleteDoc(issueRef);
            console.log('deleted');
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting document: ", error);
        } finally {
            setLoading(false);  // End delete loading
        }
    };

    // Handle screen focus (when navigating back from Edit screen)
    useFocusEffect(
        useCallback(() => {
            fetchUpdatedIssue();
        }, [])  // Empty dependency array ensures this runs when the screen is focused
    );

    function IssueNames(colName) {
        switch (colName) {
            case 'ElectricalIssues':
                return 'Electrical';
            case 'PlumbingIssues':
                return 'Plumbing';
            case 'ConstructionIssues':
                return 'Construction';
            case 'FixedLineIssues':
                return 'Fixed Line';
            case 'SecurityIssues':
                return 'Security';
            case 'ACIssues':
                return 'A/C';
            default:
                return 'Issue';
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>{IssueNames(collectionName)}</Text>
                <Text style={styles.header}>Issue</Text>
            </View>

            {/* Show loading spinner if data is still being fetched */}
                    <View style={styles.FormContainer}>
                    {fetchLoading ? (
                <View style={styles.loadingContainer}>
                <LottieView
                        source={require('../../../assets/Loading.json')} // Ensure the path is correct
                        autoPlay
                        loop
                        style={styles.lottieAnimation} // Add some styling
                    />
            </View>
            ) : (
                <ScrollView>
                
                        <View style={styles.Label}>
                            <Text style={{ fontSize: 25 }}>Name:</Text>
                        </View>
                        <View style={styles.InputBoxContainer}>
                            <TextInput
                                editable={false}
                                value={currentIssue?.name}
                                style={styles.InputBox}
                                placeholder="Please enter your name"
                            />
                        </View>

                        <View style={styles.Label}>
                            <Text style={{ fontSize: 25 }}>House Number:</Text>
                        </View>
                        <View style={styles.InputBoxContainer}>
                            <TextInput
                                editable={false}
                                value={currentIssue?.houseNumber}
                                style={styles.InputBox}
                                placeholder="Please enter the number of your house"
                            />
                        </View>

                        <View style={styles.Label}>
                            <Text style={{ fontSize: 25 }}>Problem:</Text>
                        </View>
                        <View style={styles.InputBoxContainer}>
                            <TextInput
                                value={currentIssue?.problem}
                                editable={false}
                                multiline
                                numberOfLines={4}
                                maxLength={40}
                                style={styles.InputBoxBig}
                                placeholder="Your problem in brief..."
                            />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: 350, justifyContent: 'center', marginTop: 20 }}>
                                {currentIssue?.isEnabled ? (
                                    <View style={styles.switchContainer}>
                                        <View style={[styles.switchBox, styles.activeBoxUrgent]}>
                                            <Text style={styles.switchText}>Urgent</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.switchContainer}>
                                        <View style={[styles.switchBox, styles.activeBoxNotUrgent]}>
                                            <Text style={styles.switchText}>Not Urgent</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.ButtonContainer}>
                            {loading ? (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                            ) : (
                                <>
                                    
                                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteIssue}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                </ScrollView>
            )}
                    </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor: colors.primary,
    },
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for your needs
        left: 20, // Adjust for your needs
        zIndex: 1, // Make sure it's above the content
      },
      backButtonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
      },
    headerContainer:{
        paddingTop:70,
        alignItems:'flex-end',
        paddingBottom:8,
        paddingRight:40,
    },
    header:{
        fontSize:40,
        color: colors.white,
        fontWeight:'bold',
    },
    FormContainer:{
        paddingTop:30,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },

    //form content styles

    Label:{
        paddingLeft:20,
        paddingTop:30,
        fontSize:20,
    },
    InputBoxContainer:{
        alignItems:'center',
        paddingTop:8,
    },
    InputBox:{
        borderWidth:1,
        borderRadius:5,
        borderColor: colors.primary,
        paddingLeft:20,
        height:47,
        width:340,
        color:colors.black
    },
    InputBoxBig:{
        borderWidth:1,
        borderRadius:5,
        borderColor: colors.primary,
        paddingLeft:20,
        height:170,
        width:340,
        paddingTop:8,
        justifyContent:'flex-start',
        textAlignVertical: 'top',
        color:colors.black,
    },
    ButtonContainer: {
        marginTop:20,
        flexDirection: 'row', // Arrange buttons side by side
        justifyContent: 'center', // Center align buttons horizontally
        alignItems: 'center', // Center align buttons vertically
        marginBottom: 50,
        gap: 20, // Space between buttons
    },
    button: {
        width: 120, // Adjust width as needed
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    editButton: {
        backgroundColor: colors.button, // Custom color for Edit button
    },
    deleteButton: {
        backgroundColor: colors.buttonDelete, // Custom color for Delete button
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add some transparency to the background
    },

    switchContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    switchBox: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
    },
    activeBoxUrgent: {
        backgroundColor: colors.urgent,  // Green color for active state
    },
    activeBoxNotUrgent: {
        backgroundColor: colors.Noturgent,  // Green color for active state
    },
    switchText: {
        color: '#fff',
        fontWeight: '600',
    }

})
export default ViewIssueSimpleAdmin;