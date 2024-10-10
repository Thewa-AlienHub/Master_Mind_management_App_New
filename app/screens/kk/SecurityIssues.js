import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Switch, TouchableOpacity,ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc,collection } from 'firebase/firestore';
import { DB } from '../../config/DB_config';

function SecurityIssues({ navigation,route }) {
  const {email} = route.params;
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [Loading,setLoading] = useState(false);

    const[name,setName] = useState('');
    const[houseNumber,setHouseNumber] = useState('');
    const[problem,setProblem] = useState('');
  const [value, setValue] = useState(null);
  const [otherIssue, setOtherIssue] = useState('');

  const items = [
    { label: 'CCTV', value: 'CCTV' },
    { label: 'Door Phone', value: 'Door_Phone' },
    { label: 'Access Control', value: 'Access_Control' },
    { label: 'Other', value: 'Other' },
  ];

  function addData() {
    setLoading(true);
    addDoc(collection(DB, "SecurityIsues"), {
        email: email,  // Include the email in the document data
        name: name,
        houseNumber: houseNumber,
        problem: problem,
        type : value,
        otherIssue:otherIssue,
        isEnabled: isEnabled
      })
      .then(() => {
        console.log('Data added');
        navigation.navigate('DoneScreen',{email:email});
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" size={30} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Security</Text>
        <Text style={styles.header}>Issues</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Name Input */}
        <View style={styles.formFieldName}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Name:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
              value={name}
              onChangeText={(text)=>setName(text)}
              style={styles.InputBox}
              placeholder="Please enter your name"
            />
          </View>
        </View>

        {/* House Number Input */}
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

        {/* Dropdown for Issues */}
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

        {/* Conditionally render input box for 'Other' */}
        {value === 'Other' && (
          <View style={styles.formField}>
            <View style={styles.Label}>
              <Text style={{ fontSize: 25 }}>Please specify the issue:</Text>
            </View>
            <View style={styles.InputBoxContainer}>
              <TextInput
                style={styles.InputBox}
                placeholder="Enter your issue"
                value={otherIssue}
                onChangeText={setOtherIssue}
              />
            </View>
          </View>
        )}

        {/* Problem Details TextArea */}
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

        {/* Urgent Fix Switch */}
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

        {/* Submit Button */}
        <View style={styles.formField}>
        <View style={styles.ButtonContainer}>
                        {/* Show loading animation when submitting */}
                        {Loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />  // Add loading spinner
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={addData}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
        </View>

      </ScrollView>
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
    paddingTop: 70,
    alignItems: 'center',
    paddingBottom: 8,
  },
  header: {
    fontSize: 40,
    color: colors.white,
    fontWeight: 'bold',
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
    borderRadius: 5, // Optional: to match the InputBox style
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
    flex: 1,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
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
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default SecurityIssues;
