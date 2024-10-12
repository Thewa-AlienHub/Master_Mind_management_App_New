import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../../../Utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

function SuccessScreen02_03edit({ navigation, drawer, data }) {
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading</Text>
                </View>
            ) : (
                <>
                    <View style={styles.ContentHeader}>
                        <Text style={styles.TopBarText}>
                            You Successfully {"\n"} Edit the {"\n"} Reservation
                        </Text>
                    </View>
                    <View style={styles.ContentBody}>
                        <Icon name="check-circle" size={100} color="green" style={styles.doneIcon} />
                        <Text style={styles.bodyText}>
                            Updated the amenity for your reservation
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.okButton} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.okButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white,
    },
    ContentHeader: {
        width: '100%',
        height: height * 0.45,
        backgroundColor: colors.backgroundcolor1,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
        paddingHorizontal: 30,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    ContentBody: {
        backgroundColor: colors.light,
        marginHorizontal: 60,
        marginTop: '5%',
        width: '70%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.35,
        borderRadius: 20,
    },
    doneIcon: {
        marginBottom: 20, // Adds space below the icon
    },
    bodyText: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.dark,
        marginTop: 10,
    },
    okButton: {
        backgroundColor: colors.Button1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 20,
        marginHorizontal: 90,
    },
    okButtonText: {
        color: colors.white,
        fontSize: 24,
    },
    TopBarText: {
        fontSize: 42,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center', // Center the text horizontally
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2.5 : 70,
    },
});

export default SuccessScreen02_03edit;
