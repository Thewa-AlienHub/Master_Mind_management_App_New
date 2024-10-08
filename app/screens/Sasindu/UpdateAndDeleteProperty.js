import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, StatusBar, ScrollView, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { DB } from '../../config/DB_config'; 
import * as ImagePicker from 'expo-image-picker';

function UpdateAndDeleteProperty({ route, navigation }) {
    const { property } = route.params; // Get the property details passed from the previous screen
    const [type, setType] = useState(property.type);
    const [name, setName] = useState(property.name);
    const [price, setPrice] = useState(property.price);
    const [description, setDescription] = useState(property.description);
    const [imageUri, setImageUri] = useState(property.imageUrl); // State for the image URI

    const handleUpdate = async () => {
        try {
            const propertyRef = doc(DB, "properties", property.id);
            await updateDoc(propertyRef, {
                type,
                name,
                price,
                description,
                imageUrl: imageUri // Add imageUrl to the update
            });
            Alert.alert("Success", "Property updated successfully!");
            navigation.goBack(); // Navigate back after update
        } catch (error) {
            console.error("Error updating property:", error);
            Alert.alert("Error", "Could not update the property.");
        }
    };

    const handleDelete = async () => {
        try {
            const propertyRef = doc(DB, "properties", property.id);
            await deleteDoc(propertyRef);
            Alert.alert("Success", "Property deleted successfully!");
            navigation.goBack(); // Navigate back after deletion
        } catch (error) {
            console.error("Error deleting property:", error);
            Alert.alert("Error", "Could not delete the property.");
        }
    };

    const pickImage = async () => {
        // Ask the user for the permission to access the media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        // Launch the image picker
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Set the selected image URI
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back-outline" size={34} color="white" />
                </TouchableOpacity>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar}>Manage</Text>
                    <Text style={styles.TopBar1}>Property</Text>
                </View>
            </View>
        
            <ScrollView style={styles.formbackground}>
            <View style={{top:25,marginBottom:100}}>
                <TouchableOpacity onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>Pick an image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{alignItems:'center',top:-10}}><Text style={{fontSize:18,fontWeight:'bold',color:'#002C9D'}}>{type}</Text></View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Property Type</Text>
                    <TextInput 
                        style={styles.input}
                        value={type}
                        onChangeText={setType}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Property Name</Text>
                    <TextInput 
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput 
                        style={styles.input}
                        value={price}
                        keyboardType="numeric"
                        onChangeText={setPrice}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
            
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
    TopBar: {
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top: -10,
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
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: 'black',
        marginLeft:14
    },
    input: {
        height: 50,
        width:330,
        marginLeft:14,
        borderColor: '#567FE8',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 17,
        backgroundColor: '#F7F9FF',
        color:'#002C9D',
        fontWeight:'900'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#002C9D',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginRight: 5, // Space between buttons
    },
    buttonDelete: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5, // Space between buttons
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    image: {
        width: '50%',
        height: 130,
        borderRadius: 15,
        marginBottom: 15,
        marginLeft: '25%',
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    placeholderText: {
        color: '#aaaaaa',
    },
});

export default UpdateAndDeleteProperty;
