import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../Utils/colors';
import { DB } from '../../../config/DB_config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

function IssuesEmailWise({ route, navigation }) {
    const { email,collectionName } = route.params;
    

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

        const fetchData = async () => {
            try {
                const q = query(
                    collection(DB, collectionName),
                    where("email", "==", email) // Filter by the email parameter
                );

                const querySnapshot = await getDocs(q);
                const dataList = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id // Include document ID in the data
                }));

                setData(dataList);
                
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

    useFocusEffect(
        useCallback(()=>{
            fetchData();
        })
    )

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Electrical Issues for {email}</Text>
            </View>
            <View style={styles.FormContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : data.length === 0 ? (
                        <Text>No data available for this email</Text>
                    ) : (
                        data.map((item, index) => (
                            <TouchableOpacity key={index}  onPress={() => {
                                if (collectionName === 'ElectricalIssues' || collectionName === 'PlumbingIssues' || collectionName === 'ACIssues' ) {
                                    navigation.navigate('ViewIssueSimpleAdmin',{ 
                                        documentId: item.id, 
                                        collectionName:collectionName, 
                                        email:email
                                    });
                                }else{
                                    navigation.navigate('ViewIssueComplexAdmin',{ 
                                        documentId: item.id, 
                                        collectionName:collectionName, 
                                        email:email})
                                } }}>
                            <View  style={styles.itemContainer}>
                                <Text style={styles.itemText}>Name: {item.name}</Text>
                                <Text style={styles.itemText}>Details: {item.problem}</Text> 
                                <View style={styles.separator} />
                            </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    headerContainer: {
        paddingTop: 70,
        alignItems: 'flex-end',
        paddingBottom: 8,
        paddingRight: 40,
    },
    header: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
    },
    FormContainer: {
        paddingTop: 30,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: colors.white,
        flex: 1,
        elevation: 50,
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    separator: {
        height: 10,
    },
});

export default IssuesEmailWise;
