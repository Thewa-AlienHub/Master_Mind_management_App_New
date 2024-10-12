import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, Image, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../Utils/colors';

const { height, width } = Dimensions.get('window'); // Get full screen dimensions

function LandingPage({ navigation }) {
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const text1Opacity = useRef(new Animated.Value(0)).current;
    const text2Opacity = useRef(new Animated.Value(0)).current;
    const text3Opacity = useRef(new Animated.Value(0)).current;
    const text4Opacity = useRef(new Animated.Value(0)).current;
    const text5Opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sequence of animations for logo and texts
        Animated.sequence([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.stagger(300, [
                Animated.timing(text1Opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(text2Opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(text3Opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(text4Opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(text5Opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <View style={styles.titleContainer}>
                    <Animated.Image
                        source={require("../assets/MMLogo.png")}
                        style={[styles.logo, { opacity: logoOpacity }]}
                    />
                </View>
            </View>

            <View style={styles.SloganContainer}>
                <Animated.Text style={[styles.Text1, { opacity: text1Opacity }]}>
                    Building,
                </Animated.Text>
                <Animated.Text style={[styles.Text2, { opacity: text2Opacity }]}>
                    Connections...
                </Animated.Text>
                <Animated.Text style={[styles.Text1, { opacity: text3Opacity }]}>
                    Empowering,
                </Animated.Text>
                <Animated.Text style={[styles.Text2, { opacity: text4Opacity }]}>
                    Communities...
                </Animated.Text>
                <Animated.Text style={[styles.Text4, { opacity: text5Opacity }]}>
                your all in one hub for {"\n"}seamless Living & Smarter {"\n"}Management....
                </Animated.Text>
            </View>

            <View style={styles.GoButton}>
            <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                <Text style={styles.GoText}>Go</Text>

            </TouchableOpacity>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.white,
    },
    TopBarContainer: {
        backgroundColor: colors.backgroundcolor1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 15,
        width: '100%',
        borderBottomStartRadius: 130,
        borderBottomEndRadius: 130,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: height * 0.42, // Adjust height for full-screen experience
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        right: 20, // Adjust position
        bottom: 20, // Adjust position
    },
    logo: {
        top: 5,
        left:15,
        width: 170,
        height: 170,
    },
    TopBar: {
        top: 12,
        fontSize: 60,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    SloganContainer: {
        flex: 1,
        alignItems: 'flex-start',
        left:30,
        paddingTop: height * 0.05, // Adjust padding for full-screen
    },
    Text1: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    Text2: {
        fontSize: 35,
        fontWeight:"400",
    },
    Text3: {
        fontSize: 50,
        fontWeight: 'bold',
    },
    Text4: {
        paddingTop:30,
        fontSize: 20,
        fontWeight: '400',
    },
    GoButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        borderWidth: 3,
        width: 100,
        padding: 5,
        height: 52,
        borderRadius: 20,
        borderColor: colors.backgroundcolor1,
        backgroundColor: colors.backgroundcolor1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    GoText: {
        fontSize: 25,
        color: colors.white,
        fontWeight: 'bold',
    },
});

export default LandingPage;
