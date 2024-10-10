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
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import { collection, addDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';

function AddCardDetails({ navigation, route }) {
    const { totalAmount,email} = route.params;
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const [cardNumber, setCardNumber] = useState('');
    const [expire, setExpre] = useState(''); // Separate state for email
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State for errors

    const validateFields = () => {
        const newErrors = {};

        if (!cardNumber) {
            newErrors.cardNumber = "Your name is required";
        }
        if (!expire) {
            newErrors.expire = "Email is required";
        }
        if (!cvv || !/^\d{10}$/.test(num)) {
            newErrors.cvv = "Mobile number must be 10 digits";
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
                cardNumber,
                expire,
                cvv,
                totalAmount,
                createdAt: new Date(),
            });

            // Reset form fields
            setCardNumber('');
            setExpre('');
            setCvv('');

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
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.backButton}>
                            <Icon name="notifications" size={28} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('success',{email})} style={styles.backButton}>
                            <Icon name="cart" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar1}>Payment</Text>
                </View>
            </View>
            
            <ScrollView style={styles.formbackground}>
            <Image
                source={require("../../assets/card-removebg-preview.png")}
                style={styles.visaImg}
            />
                <View style={styles.formContainer}>
                    <View style={isMobile ? null : styles_web.form}>
                        <View style={styles.addressLabelContainer}>
                        <View style={styles.card}>
                                {/* Name Input */}
                                <Text style={styles.label}>Card Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0000 0000 0000 0000"
                                    keyboardType="numeric"
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    placeholderTextColor="#B0B0B0" // Light gray color for the placeholder
                                />
                               {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}

                               <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Expiration Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="MM/YY"
                                value={expire}
                                onChangeText={setExpre}
                            />
                            {errors.expire && <Text style={styles.errorText}>{errors.expire}</Text>}
                        </View>
                        <View style={[styles.inputContainer, { marginLeft: 10 }]}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="CVV"
                                keyboardType="numeric"
                                value={cvv}
                                onChangeText={setCvv}
                            />
                            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                        </View>
                    </View>

                    <Text style={styles.label}>Total: LKR {totalAmount}</Text>

                               {/* Button */}
                    <View style={styles.ButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('success',{email,totalAmount})}>
                            <Text style={styles.buttonText}>Pay LKR </Text>
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
        fontSize: 41,
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
    visaImg: {
        top: 75,
        marginLeft: 135,
        width: 135,
        height: 85,
    },
    formContainer: {
        width: '100%',
        padding: 20, // Added padding for better appearance
        top: -20,
    },
    LableContainer: {
        paddingTop: 3,
    },
    label: {
        paddingLeft: 20,
        fontSize: 21,
        color: 'black',
    },
    addressLabelContainer: {
        alignItems:'center',
        top:35
        
    },
    ButtonContainer: {
        flex: 1,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#F1F5FF',
        padding: 20,
        marginVertical: 80,
        borderRadius: 15,
        borderColor: '#7D9AE4',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputContainer: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#567FE8',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor:'#F7F7F7'
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

export default AddCardDetails;
