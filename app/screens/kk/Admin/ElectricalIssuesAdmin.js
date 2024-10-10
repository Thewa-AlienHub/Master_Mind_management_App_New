import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../../config/DB_config';
import { collection, getDocs } from "firebase/firestore";

function ElectricalIssuesAdmin({ navigation,route }) {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const {collectionName} = route.params;
    console.log(collectionName);
    


    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(DB, collectionName));
                // Use a Set to ensure unique email addresses
                const emailSet = new Set(querySnapshot.docs.map(doc => doc.data().email).filter(email => email));
                setEmails(Array.from(emailSet)); // Convert Set back to array
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function IssueNames(colName) {
        switch (colName) {
            case 'ElectricalIssues':
                return ('Electrical');
                break;
            case 'PlumbingIssues':
                return ('Plumbing');
                break;
            case 'ConstructionIssues':
                return ('Construction');
                break;
            case 'FixedLineIssues':
                return ('Fixed Line');
                break;
            case 'SecurityIssues':
                return ('Security');
                break;
            case 'ACIssues':
                return ('A/C');
                break;
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MaintenanceAddAdmin')}>
                <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{IssueNames(collectionName)}</Text>
                <Text style={styles.header}>Issues</Text>
            </View>
            <View style={styles.FormContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : emails.length === 0 ? (
                        <Text>No data available</Text>
                    ) : (
                        emails.map((email, index) => (
                            <TouchableOpacity key={index} onPress={()=>navigation.navigate('IssuesEmailWise',{email:email, collectionName:collectionName})}>
                            <View  style={styles.itemContainer}>
                                <Text style={styles.itemText}>Email: {email}</Text>
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
        fontSize: 40,
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

export default ElectricalIssuesAdmin;
