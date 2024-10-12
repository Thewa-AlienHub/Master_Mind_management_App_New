import React, { useEffect, useState,useCallback } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../config/DB_config';
import colors from "../../Utils/colors";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

export default function IssueList({route,navigation}) {
    const { email } = route.params;
    const [loading,setLoading] = useState(true);


    const [issues, setIssues] = useState([]);
    const collections = [
        "ElectricalIssues",
        "PlumbingIssues",
        "ConstructionIssues",
        "FixedLineIssues",
        "SecurityIssues",
        "ACIssues"
    ];

    
        const fetchData = async () => {
            try {
                setLoading(true);
                const allIssues = [];

                
                // Fetch data from all collections
                await Promise.all(
                    
                    collections.map(async (col) => {
                        const q = query(collection(DB, col), where("email", "==", email));
                        const querySnapshot = await getDocs(q);
                        

                        querySnapshot.forEach((doc) => {
                            allIssues.push({
                                ...doc.data(),
                                id: doc.id,
                                collection: col,
                            });
                        });
                    })
                );

                
                setIssues(allIssues);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };


    useFocusEffect(
        useCallback(() => {
            fetchData(); // Fetch data each time the screen is focused
        }, [email])
    );

    function IssueNames(colName) {
        switch (colName) {
            case 'ElectricalIssues':
                return ('Electrical Issue');
                break;
            case 'PlumbingIssues':
                return ('Plumbing Issue');
                break;
            case 'ConstructionIssues':
                return ('Construction Issue');
                break;
            case 'FixedLineIssues':
                return ('Fixed Line Issue');
                break;
            case 'SecurityIssues':
                return ('Security Issue');
                break;
            case 'ACIssues':
                return ('A/C Issue');
                break;
        }
    }

    function navi(colName) {
        switch (colName) {
            case 'ElectricalIssues':
                return ('ViewIssueSimple');
                break;
            case 'PlumbingIssues':
                return ('ViewIssueSimple');
                break;
            case 'ConstructionIssues':
                return ('ViewIssueComplex');
                break;
            case 'FixedLineIssues':
                return ('ViewIssueComplex');
                break;
            case 'SecurityIssues':
                return ('ViewIssueComplex');
                break;
            case 'ACIssues':
                return ('ViewIssueSimple');
                break;
        }
    }

    return (
        
            <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate('Login')}>
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Your</Text>
                <Text style={styles.header}>Issues</Text>
            </View>

                
                <View style={styles.FormContainer}>
            <ScrollView>
                {loading?(
                    <View style={styles.loadingContainer}>
                        <LottieView
                                source={require('../../assets/Loading.json')} // Ensure the path is correct
                                autoPlay
                                loop
                                style={styles.lottieAnimation} // Add some styling
                            />
                    </View>
                ) : issues.length > 0 ? (
                    issues.map((issue, index) => (
                        <TouchableOpacity key={issue.id} onPress={()=>navigation.navigate(navi(issue.collection),{issue})}>
                            <View key={issue.id} style={styles.issueCard}>
                                <Text style={styles.collectionText}>{IssueNames(issue.collection)}</Text>
                                <Text style={styles.issueId}>Issue ID: {issue.id}</Text>
                                <Text style={styles.issueId}> {issue.problem || 'No Description'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ):(
                    <View style={styles.NoIssues}>
                    <Text style={{fontSize:20}}>No Issues found</Text>
                    <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('MaintenanceAdd')}>
                        <Text style={styles.buttonText}>Add New</Text>
                    </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
        top: 40, 
        left: 20, 
        zIndex: 1, 
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
    Form:{
        paddingTop:70,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    },
    FormContainer:{
        paddingTop:70,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    },
    NoIssues:{
        alignItems:'center',
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
    },
    ButtonContainer: {
        flex: 1,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:50,
    },
    button: {
        marginTop:420,
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.button,
        borderRadius: 15,
    },
    buttonText: {
        color:colors.white,
        fontSize: 22,
        fontWeight:"bold",
    },
    scrollView: {
        backgroundColor: '#f5f5f5',
    },
 
    issueCard: {
        backgroundColor: '#e3e3e3',
        padding: 15,
        borderRadius: 8,
        borderWidth:1,
        borderColor:colors.primary,
        marginBottom: 15,
        marginLeft:20,
        marginRight:20,
        elevation: 3,
    },
    collectionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 5,
    },
    issueId: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
    },
    issueDetails: {
        fontSize: 14,
        color: '#34495e',
    },
    noIssuesText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginTop: 20,
    },
});