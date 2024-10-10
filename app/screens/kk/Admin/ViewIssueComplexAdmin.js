import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Switch, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import colors from '../../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc,deleteDoc } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';


function ViewIssueComplexAdmin({ navigation,route }) {
    const { documentId, collectionName, email } = route.params;
   
    const [currentIssue,setCurrentIssue] = useState();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    const fetchUpdatedIssue = async ()=>{
      setFetchLoading(true);
      try {
        const issueRef = doc(DB,collectionName,documentId);
        const docSnap = await getDoc(issueRef);

            if (docSnap.exists()) {
                setCurrentIssue(docSnap.data());
                
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        }finally{
          setFetchLoading(false);
        }
    };

    const deleteIssue= async()=>{
      setLoading(true);
      const issueRef = doc(DB, collectionName, documentId);
      try {
          await deleteDoc(issueRef)
          console.log('deleted');
          
          navigation.goBack();
          
      } catch (error) {
          console.error("Error deleting document: ", error);
      }finally {
        setLoading(false);  // End delete loading
    }
    }

    useFocusEffect(
      useCallback(()=>{
        fetchUpdatedIssue();
      },[])
    );

    function IssueNames(colName) {
        switch (colName) {
            case 'ElectricalIssues':
                return ('Electrical');
                break;
            case 'PlumbingIssues':
                return ('Plumbing');
                break;
            case 'ConstructionIssues':
                return ('Construction');
                break;
            case 'FixedLineIssues':
                return ('Fixed Line');
                break;
            case 'SecurityIssues':
                return ('Security');
                break;
            case 'ACIssues':
                return ('A/C');
                break;
        }
    }
    

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" size={30} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>{IssueNames(collectionName)}</Text>
        <Text style={styles.header}>Issues</Text>
      </View>
      {fetchLoading ? (
                <View style={styles.loadingContainer}>
                <LottieView
                        source={require('../../../assets/Loading.json')} // Ensure the path is correct
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
              value={currentIssue?.name}
              style={styles.InputBox}
              
            />
          </View>
        </View>


        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>House Number:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
                value={currentIssue?.houseNumber}
                style={styles.InputBox} 
                
            />
          </View>
        </View>


        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Issue Type:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
          <TextInput
                value={currentIssue?.type}
                style={styles.InputBox} 
                
            />
        </View>

        </View>

        
        <View style={styles.formField}>
          <View style={styles.Label}>
            <Text style={{ fontSize: 25 }}>Problem details:</Text>
          </View>
          <View style={styles.InputBoxContainer}>
            <TextInput
              value={currentIssue?.problem}
              editable
              multiline
              numberOfLines={4}
              maxLength={200}
              style={styles.InputBoxBig}
              
            />
          </View>
        </View>

     
        <View style={styles.formField}>
        <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 350, justifyContent: 'center',marginTop:20 }}>
                    {currentIssue?.isEnabled ? (
                            <View style={styles.switchContainer}>
                                <View style={[styles.switchBox, styles.activeBoxUrgent]}>
                                    <Text style={styles.switchText}>Urgent</Text>
                                </View>
                                
                            </View>
                        ) : (
                            <View style={styles.switchContainer}>
                                
                                <View style={[styles.switchBox, styles.activeBoxNotUrgent]}>
                                    <Text style={styles.switchText}>Not Urgent</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.ButtonContainer}>
                        {/* Conditionally hide buttons and display loading indicator */}
                        {loading ? (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : (
                            <>
                               
                                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteIssue}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
    paddingTop:30,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    alignItems: 'center',
    height: 300,
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
editButton: {
    backgroundColor: colors.button, // Custom color for Edit button
},
deleteButton: {
    backgroundColor: colors.buttonDelete, // Custom color for Delete button
},
buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
},
loadingOverlay: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add some transparency to the background
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
});

export default ViewIssueComplexAdmin;