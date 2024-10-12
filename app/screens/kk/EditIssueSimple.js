import React from 'react';
import { View,StyleSheet,Text, TextInput,Switch,TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../Utils/colors';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../config/DB_config';
import {doc, updateDoc } from "firebase/firestore"; 
import LottieView from 'lottie-react-native';


function EditIssueSimple({route,navigation}) {

    const {issue} = route.params;
    const [name, setName] = useState(issue.name || '');
    const [houseNumber, setHouseNumber] = useState(issue.houseNumber || '');
    const [problem, setProblem] = useState(issue.problem || '');
    const [isEnabled, setIsEnabled] = useState(issue.isEnabled || false);
    const [loading, setLoading] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const updateData = async ()=>{
        setLoading(true);
        const issueRef = doc(DB,issue.collection,issue.id);

        try {
            console.log('triggered');
            
            await updateDoc(issueRef,{
                name:name,
                houseNumber: houseNumber,
                problem: problem,
                isEnabled: isEnabled,
            })
            console.log('Data updated');
            navigation.navigate('ViewIssueSimple',{issue})
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    
  

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Edit</Text>
                <Text style={styles.header}>Issue</Text>
            </View>
            <View style={styles.FormContainer}>
            {loading ? (
                <View style={styles.loadingContainer}>
                <LottieView
                        source={require('../../assets/Loading.json')} // Ensure the path is correct
                        autoPlay
                        loop
                        style={styles.lottieAnimation} // Add some styling
                    />
            </View>
            ) : (
            <ScrollView>
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
                    <Text style={{fontSize:25}}>Problem:</Text>
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
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 350, justifyContent: 'center',marginTop:20 }}>
                        <Switch
                        trackColor={{ false: colors.switchFalse, true: colors.switchTrue }}
                        thumbColor={issue.isEnabled ? colors.button : colors.thumbFalseColor}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={{paddingLeft:2 }}>Switch if this need an urgent fix</Text>
                    </View>
                </View>

                <View style={styles.ButtonContainer}>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={updateData}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.discardButton]} onPress={()=>navigation.goBack()}>
                        <Text style={styles.buttonText}>Discard</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
            )}
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    lottieAnimation: {
        width: 200,
        height: 200,
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
        marginTop:20,
        flexDirection: 'row', // Arrange buttons side by side
        justifyContent: 'center', // Center align buttons horizontally
        alignItems: 'center', // Center align buttons vertically
        marginBottom: 50,
        gap: 20, // Space between buttons
    },
    button: {
        width: 120, // Adjust width as needed
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    saveButton: {
        backgroundColor: 'green', // Custom color for Edit button
    },
    discardButton: {
        backgroundColor: colors.buttonDelete, // Custom color for Delete button
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
    },

    switchContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    switchBox: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
    },
    activeBoxUrgent: {
        backgroundColor: colors.urgent,  // Green color for active state
    },
    activeBoxNotUrgent: {
        backgroundColor: colors.Noturgent,  // Green color for active state
    },
    switchText: {
        color: '#fff',
        fontWeight: '600',
    }

})
export default EditIssueSimple;