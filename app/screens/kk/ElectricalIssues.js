import React from 'react';
import { View,StyleSheet,Text, TextInput,Switch,TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../Utils/colors';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../config/DB_config';
import { addDoc, collection } from "firebase/firestore"; 

function ElectricalIssues({route,navigation}) {

    const { email } = route.params;
    console.log('email from e issues:'+email);
    
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [loading, setLoading] = useState(false);
    const[name,setName] = useState('');
    const[houseNumber,setHouseNumber] = useState('');
    const[problem,setProblem] = useState('');

    function addData() {
        setLoading(true);
        addDoc(collection(DB, "ElectricalIssues"), {
            email: email,
            name: name,
            houseNumber: houseNumber,
            problem: problem,
            isEnabled: isEnabled
          })
          .then(() => {
            console.log('Data added');
            navigation.navigate('DoneScreen',{email:email});
          })
          .catch((error) => {
            console.log(error);
          });
      }

  

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Electrical</Text>
                <Text style={styles.header}>Issues</Text>
            </View>
            <ScrollView>
            <View style={styles.FormContainer}>
                <View style={styles.Label}>
                    <Text style={{fontSize:25}}>Name:</Text>
                </View>
                <View style={styles.InputBoxContainer}>
                    <TextInput
                        value={name}
                        onChangeText={(text)=>setName(text)}
                        style={styles.InputBox} 
                        placeholder="Please enter your name"
                    />
                </View>
                <View style={styles.Label}>
                    <Text style={{fontSize:25}}>House Number:</Text>
                </View>
                <View style={styles.InputBoxContainer}>
                    <TextInput
                        value={houseNumber}
                        onChangeText={(text)=>setHouseNumber(text)}
                        style={styles.InputBox} 
                        placeholder="Please enter number of your house"
                    />
                </View>
                <View style={styles.Label}>
                    <Text style={{fontSize:25}}>Problem in brief:</Text>
                </View>
                <View style={styles.InputBoxContainer}>
                <TextInput
                        value={problem}
                        onChangeText={(text)=>setProblem(text)}
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        style={styles.InputBoxBig}
                        placeholder="Your problem in brief..."

                    />
                </View>
                <View style={{alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center',width:350 }}>
                    <Switch
                        trackColor={{ false: colors.switchFalse, true: colors.switchTrue }}
                        thumbColor={isEnabled ? colors.button : colors.thumbFalseColor}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={{paddingLeft:2 }}>Switch if this need an urgent fix</Text>
                    </View>
                </View>
                <View style={styles.ButtonContainer}>
                        {/* Show loading animation when submitting */}
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />  // Add loading spinner
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={addData}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

            </View>
            </ScrollView>


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
        top: 40, // Adjust for your needs
        left: 20, // Adjust for your needs
        zIndex: 1, // Make sure it's above the content
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
    FormContainer:{
        paddingTop:30,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    },

    //form content styles

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
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
    },
    buttonText: {
        color:colors.white,
        fontSize: 22,
        fontWeight:"bold",
    },

})
export default ElectricalIssues;