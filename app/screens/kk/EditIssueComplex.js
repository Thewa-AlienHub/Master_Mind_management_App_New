import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Switch, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc,collection,doc,updateDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import LottieView from 'lottie-react-native';


function EditIssueComplex({ navigation,route }) {
    const {issue} = route.params;
    const [name, setName] = useState(issue.name || '');
    const [houseNumber, setHouseNumber] = useState(issue.houseNumber || '');
    const [problem, setProblem] = useState(issue.problem || '');
    const [isEnabled, setIsEnabled] = useState(issue.isEnabled || false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [Loading,setLoading] = useState(false);

    

  const [value, setValue] = useState(issue.type|| '');
  console.log(value);
  
  const getItemsByCollection = (collectionName) => {
    switch (collectionName) {
        case 'ConstructionIssues': // replace with actual collection name
            return [
              { label: 'Roof', value: 'Roof' },
              { label: 'Rain Track', value: 'Rain_Track' },
              { label: 'Walls', value: 'Walls' },
              { label: 'Floor', value: 'Floor' },
              { label: 'Windows and Doors', value: 'Windows_and_Doors' },
            ];
        case 'FixedLineIssues': // replace with actual collection name
            return [
              { label: 'ADSL', value: 'ADSL' },
              { label: 'Broadband', value: 'Broadband' },
              { label: 'Router', value: 'Router' },
              { label: 'Satelite TV', value: 'Satelite_TV' },
            ];
        case 'SecurityIssues': // replace with actual collection name
            return [
              { label: 'CCTV', value: 'CCTV' },
              { label: 'Door Phone', value: 'Door_Phone' },
              { label: 'Access Control', value: 'Access_Control' },
              { label: 'Other', value: 'Other' },
            ];
        
        default:
            return [
                { label: 'Select an issue', value: null }, // Default case
            ];
    }
};

const items = getItemsByCollection(issue.collection);

  const updateData = async ()=>{

    const issueRef = doc(DB,issue.collection,issue.id);

    try {
      setLoading(true);
        console.log('triggered');
        
        await updateDoc(issueRef,{
            name: name,
            houseNumber: houseNumber,
            problem: problem,
            type : value,
            isEnabled: isEnabled
        })
        console.log('Data updated');
        navigation.navigate('ViewIssueComplex',{issue})
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};
 

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MaintenanceAdd')}>
        <Icon name="chevron-back-outline" size={30} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Edit</Text>
        <Text style={styles.header}>Issues</Text>
      </View>
      {Loading ? (
                <View style={styles.loadingContainer}>
                <LottieView
                        source={require('../../assets/Loading.json')} // Ensure the path is correct
                        autoPlay
                        loop
                        style={styles.lottieAnimation} // Add some styling
                    />
            </View>
            ) : (
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
    
        <View style={styles.formFieldName}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Name:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
              onChangeText={(text)=>setName(text)}
              value={name}
              style={styles.InputBox}
              placeholder="Please enter your name"
            />
          </View>
        </View>


        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>House Number:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
                value={houseNumber}
                onChangeText={(text)=>setHouseNumber(text)}
                style={styles.InputBox} 
                placeholder="Please enter number of your house"
            />
          </View>
        </View>


        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Select an issue:</Text>
          </View>
          <View style={styles.InputBoxDropMenuContainer}>
  <RNPickerSelect
    onValueChange={(value) => setValue(value)}
    items={items}
    placeholder={{
      label: 'Select an issue',
      value: null,
    }}
    style={{
      inputIOS: styles.InputBox,
      inputAndroid: styles.InputBox, 
      placeholder: { color: colors.placeholder },
    }}
    value={value}
  />
</View>

        </View>

        
        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Problem details:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
              value={problem}
              onChangeText={(text)=>setProblem(text)}
              editable
              multiline
              numberOfLines={4}
              maxLength={200}
              style={styles.InputBoxBig}
              placeholder="Describe your problem"
            />
          </View>
        </View>

     
        <View style={styles.formField}>
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
        </View>


        <View style={styles.formField}>
        <View style={styles.ButtonContainer}>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={updateData}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.discardButton]} onPress={()=>navigation.goBack()}>
                        <Text style={styles.buttonText}>Discard</Text>
                    </TouchableOpacity>
                </View>
        </View>

      </ScrollView>
            )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  headerContainer: {
    paddingTop:70,
        alignItems:'flex-end',
        paddingBottom:8,
        paddingRight:40,
  },
  header: {
    fontSize: 40,
    color: colors.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        elevation:50,
    alignItems: 'center',
    flex:1,
},
lottieAnimation: {
    width: 200,
    height: 200,
},
  scrollContent: {
    paddingBottom: 50,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    elevation: 50,
  },
  Label: {
    paddingLeft: 10,
    paddingTop: 30,
  },
  InputBoxContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  InputBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    paddingLeft: 20,
    height: 47,
    width: 340,
  },
  InputBoxDropMenuContainer: {
    marginLeft: 20,
    height: 47,
    width: 340,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  
  InputBoxBig: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    paddingLeft: 20,
    height: 170,
    width: 340,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  formField: {
    marginBottom: 20,
    paddingLeft:10,
  },
  formFieldName: {
    paddingLeft:10,
    paddingTop:30,
    marginBottom: 20,
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
});

export default EditIssueComplex;