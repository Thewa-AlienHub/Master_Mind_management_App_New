import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../../Utils/colors';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import MenuButton from '../../../Components/MenuButton';


const { width, height } = Dimensions.get('window');

function TeamList_03({ navigation,drawer,data }) {
   
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = (text) => {
        setSearchQuery(text);
    
        if (Array.isArray(reportedList)) {
          const filteredData = reportedList.filter(
            (item) => item.id.toString().includes(text.toString()) || item.AlertStatus.toString().includes(text)
          );
          setFilteredAlertStatus(filteredData);
        }
      };


    return (
        
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading</Text>
                </View>
                ) : (
                    <>
                        <View style={styles.TopBarContainer}>
                            <Text style={styles.TopBar}>       Amenity{'\n'}Booking List</Text>
                        
                        </View>
                        <View style= {styles.formbackground}>
                        <View style={styles.formContainer}>
                        <View style={styles.headerlistContainer}>
                            <MenuButton color={colors.Button1} onPress={() => drawer.current.openDrawer()} />
                            <View style={styles.searchContainer}>
                                <TextInput
                                style={styles.searchInput}
                                placeholder="Search Bookings..."
                                placeholderTextColor={colors.subitm}
                                value={searchQuery}
                                onChangeText={handleSearch}
                                />
                            </View>
                        </View>
                        <ScrollView style={styles.scrollViewContainer}>
                            
                        <View style={styles.ListContainer}>
                            
                        </View>
                        
                        </ScrollView>
                        </View>
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
        backgroundColor: colors.backgroundcolor1,
    
    },
    TopBarContainer: {
       
      
        width: '90%',
        justifyContent: "center",
        alignItems:"flex-end",
        
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1: 70,
        
    },
    TopBar: {
        fontSize: 42,
        color: colors.backgroundcolor2,
        fontWeight: 'bold',
        alignItems:"flex-end",
    },
    formContainer: {
        
        paddingHorizontal: 20,
        width: '95%',
        alignSelf: 'center',
        
      
        
    },
    formbackground: {
        backgroundColor: colors.backgroundcolor2,
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        height: 1000,
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 0.05: 30,
    },
    loadingText:{
        color:colors.primary,
        fontSize:30,
        textAlign:"center"
    },
    loadingContainer:{
       margin: 100,
       marginTop:300,
       justifyContent:"center",
       backgroundColor:colors.light,
       padding:20,
       borderRadius:20,
          
    },
    headerlistContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        
       
    
      },
      searchContainer: {
        paddingHorizontal: 10,
        marginTop: 30,
        width: '85%',
        
      },
      searchInput: {
        
        padding: 10,
        borderRadius: 40,
        color: colors.Button1,
        fontSize: 18,
        width: '100%',
        borderColor: colors.Button1,
        borderWidth: 2,
        
      },
      scrollViewContainer:{
        width:'100%',
        padding:10,
        marginBottom: height*0.25,
        backgroundColor:colors.backgroundcolor1,
      },
      ListContainer:{
        
      },
});

export default TeamList_03;
