import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import { collection, addDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';

function PlaceOrder({ navigation, route }) {
    const { cartItems, totalAmount ,email} = route.params;
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const [name, setName] = useState('');
    const [address, setAddress] = useState(''); // Separate state for email
    const [num, setNum] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State for errors

    const validateFields = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = "Your name is required";
        }
        if (!address) {
            newErrors.address = "Email is required";
        }
        if (!num || !/^\d{10}$/.test(num)) {
            newErrors.num = "Mobile number must be 10 digits";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const submitCusDetails = async () => {
        if (!validateFields()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);
        try {
            // Add the property to Firestore
            await addDoc(collection(DB, 'orderDetails'), {
                email,
                name,
                address,
                num,
                cartItems,
                totalAmount
            });

            Alert.alert('Success', 'Property added successfully!!', [
                { text: 'OK', onPress: () => navigation.navigate('addCard',{totalAmount}) },
            ]);

            // Reset form fields
            setName('');
            setAddress('');
            setNum('');

        } catch (error) {
            console.error('Error adding property: ', error);
            Alert.alert('There was an error adding the property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-back-outline" size={34} color="white" />
                    </TouchableOpacity>
                    <View style={styles.rightButtons}>
                        <TouchableOpacity onPress={() => navigation.navigate('addNotification')} style={styles.backButton}>
                            <Icon name="notifications" size={28} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('cart',{email})} style={styles.backButton}>
                            <Icon name="cart" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar1}>Payment</Text>
                </View>
            </View>
            <ScrollView style={styles.formbackground}>
                <View style={styles.formContainer}>
                    <View style={{alignItems:'center'}}>
                    <Text style={styles.paymentText}>Total Payment : LKR{totalAmount}</Text>
                    </View>
                    <View style={isMobile ? null : styles_web.form}>
                        <View style={styles.addressLabelContainer}>
                            <View style={{ top: 90,marginBottom:90 }}>
                                {/* Name Input */}
                                <View style={styles.LableContainer}>
                                    <Text style={styles.label}>Name :</Text>
                                </View>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    style={[styles.inputBox, errors.name && styles.inputError]}
                                    placeholder="Enter name"
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                                {/* Address Input */}
                                <View style={styles.LableContainer}>
                                    <Text style={styles.label}>Address :</Text>
                                </View>
                                <TextInput
                                    value={address}
                                    onChangeText={setAddress}
                                    style={[styles.inputBox, errors.address && styles.inputError]}
                                    placeholder="Enter Address"
                                />
                                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                                {/* Phone Input */}
                                <View style={styles.LableContainer}>
                                    <Text style={styles.label}>Mobile No :</Text>
                                </View>
                                <TextInput
                                    value={num}
                                    onChangeText={setNum}
                                    style={[styles.inputBox, errors.num && styles.inputError]}
                                    placeholder="07#-######"
                                    keyboardType="numeric"
                                />
                                {errors.num && <Text style={styles.errorText}>{errors.num}</Text>}

                                <View style={styles.ButtonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={submitCusDetails} disabled={loading}>
                                        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Next'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
        position: 'relative',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 14,
        position: 'absolute',
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    rightButtons: {
        flexDirection: 'row',
    },
    backButton: {
        marginLeft: 8,
    },
    TopBar1: {
        fontSize: 35,
        color: colors.white,
        fontWeight: 'bold',
        top: -19,
    },
    topBarTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formbackground: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    formContainer: {
        width: '100%',
        padding: 20, // Added padding for better appearance
        top: -20,
    },
    paymentText: {
        top:50,
        fontSize:23,
        fontWeight:'600'

    },
    LableContainer: {
        paddingTop: 3,
    },
    label: {
        paddingLeft: 20,
        fontSize: 19,
        color: 'black',
    },
    addressLabelContainer: {
        paddingTop: 4,
        margin: 15,
    },
    ButtonContainer: {
        flex: 1,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#567FE8',
        fontSize: 17,
        borderRadius: 10,
        backgroundColor: '#F7F9FF',
        top: -6,
    },
    button: {
        width: 292,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#002C9D',
        borderRadius: 15,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        paddingLeft: 20,
        fontSize: 14,
        top: -8,
    },
    inputError: {
        borderColor: 'red',
    },
});

export default PlaceOrder;
