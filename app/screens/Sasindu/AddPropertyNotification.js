import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';

function AddPropertyNotification({ route, navigation }) {
    // Destructure with fallback values
    const { name = 'Unknown Property', price = 'N/A' } = route.params || {};

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
                        <TouchableOpacity onPress={() => navigation.navigate('cart')} style={styles.backButton}>
                            <Icon name="cart" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar1}>Notifications</Text>
                </View>
            </View>
            <View style={styles.formBackground}>
                <Text style={styles.notificationText}>Property "{name}" added successfully!</Text>
                <Text style={styles.notificationText}>Price: ${price}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#567FE8',
        width: '100%',
    },
    TopBarContainer: {
        backgroundColor: '#567FE8',
        flex: 0.15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 14,
        position: 'absolute',
        top: 45,
    },
    rightButtons: {
        flexDirection: 'row',
    },
    backButton: {
        marginLeft: 8,
    },
    TopBar1: {
        fontSize: 34,
        color: colors.white,
        fontWeight: 'bold',
        top: -19,
    },
    topBarTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formBackground: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationText: {
        fontSize: 18,
        margin: 10,
        color: '#333',
    },
});

export default AddPropertyNotification;
