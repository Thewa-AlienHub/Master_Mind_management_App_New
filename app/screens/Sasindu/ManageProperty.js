import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Platform, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore'; 
import { DB } from '../../config/DB_config'; 
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

function ManageProperty({ navigation }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigation();

    const fetchProperties = useCallback(async () => {
        try {
            const propertiesRef = collection(DB, "properties");
            const querySnapshot = await getDocs(propertiesRef);
            const fetchedProperties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProperties(fetchedProperties);
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchProperties();
        }, [fetchProperties])
    );

    const renderProperty = ({ item }) => (
        <View style={styles.propertyItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.propertyImage} />
            <View style={styles.propertyDetails}>
                <Text style={styles.propertyType}>{item.type}</Text>
                <Text style={styles.propertyPrice}>{item.name}</Text>
                <Text style={styles.propertyPrice}>Rs : {item.price}</Text>
                <Text style={styles.propertyDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity 
                
                onPress={() => navigation.navigate('updateDelete', { property: item })}
            >
                 <Icon name="arrow-forward-circle" size={35} color="#002C9D" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back-outline" size={34} color="white" />
                </TouchableOpacity>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar1}>Properties</Text>
                </View>
            </View>
            <View style={styles.formbackground}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading properties...</Text>
                ) : (
                    <FlatList
                        data={properties}
                        renderItem={renderProperty}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )} 
            </View>
        <View style={styles.add}>
                    <TouchableOpacity style={{backgroundColor:"white"}}  onPress={() => navigation.navigate('addProperty')}>
                    <Icon name="add-circle" style={{ fontWeight: 'bold', color:'#002C9D', fontSize: 56,marginLeft:310,marginBottom:10 }} />
                </TouchableOpacity>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#567FE8',
    },
    TopBarContainer: {
        backgroundColor: '#567FE8',
        flex: 0.15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 14,
        marginTop: 7,
        fontWeight: '900',
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    TopBar1: {
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top: -19,
    },
    topBarTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 185,
    },
    formbackground: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        padding: 20,
    },
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30,
    },
    listContainer: {
        paddingBottom: 20,
    },
    propertyItem: {
        top:30,
        backgroundColor: '#F1F4FF',
        borderRadius: 15,
        marginBottom: 15,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },
    propertyImage: {
        width: 110,
        height: 100,
        borderRadius: 14,
        marginRight: 15,
        borderColor:'#567FE8',
        borderWidth:1
    },
    propertyDetails: {
        flex: 1,
        marginLeft:10
    },
    propertyType: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom:4
    },
    propertyPrice: {
        fontSize: 16,
        color: 'black',
    },
    propertyDescription: {
        fontSize: 14,
        color: 'gray',
    },
    viewDetailsButton: {
        backgroundColor: '#002C9D',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    add: {
        backgroundColor:'white'
    }
   
});

export default ManageProperty;
