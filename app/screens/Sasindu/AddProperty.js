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
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/DB_config';

function AddProperty({ navigation }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [phoneImageUri, setPhoneImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for errors

  const validateFields = () => {
    const newErrors = {};

    if (!type) {
      newErrors.type = "Property type is required";
    }
    if (!name) {
      newErrors.type = "Property name is required";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    if (!imageUri) { // Check if image is selected
      newErrors.imageUri = "Image is required"; // Add image validation error
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const submitProperty = async () => {
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }
  
    setLoading(true);
    try {
      let imageUrl = '';
      let phoneImageUrl = '';
  
      // Upload the property image to Firebase Storage if an image is selected
      if (imageUri) {
        const imageBlob = await fetch(imageUri).then(res => res.blob());
        const storageRef = ref(storage, `propertyImages/${Date.now()}.jpg`);
        await uploadBytes(storageRef, imageBlob);
        imageUrl = await getDownloadURL(storageRef); // Get the download URL
      }
  
      // Upload the phone image to Firebase Storage if selected
      if (phoneImageUri) {
        const phoneImageBlob = await fetch(phoneImageUri).then(res => res.blob());
        const phoneImageRef = ref(storage, `phoneImages/${Date.now()}.jpg`);
        await uploadBytes(phoneImageRef, phoneImageBlob);
        phoneImageUrl = await getDownloadURL(phoneImageRef); // Get the download URL
      }
  
      // Add the property to Firestore
      await addDoc(collection(DB, 'properties'), {
        type,
        name,
        price,
        description: propertyDescription,
        imageUrl,
        phoneImageUrl,
        createdAt: new Date(),
      });
  
      Alert.alert('Success', 'Property added successfully!!', [
        { text: 'OK', onPress: () => navigation.navigate('addProperty') },
      ]);
  
      // Reset form fields
      setType('');
      setName('');
      setPrice('');
      setPropertyDescription('');
      setImageUri(null);
      setPhoneImageUri(null);
    } catch (error) {
      console.error('Error adding property: ', error);
      Alert.alert('There was an error adding the property. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const selectImage = async (isPhoneImage) => {
    try {
      // Request permission to access the camera roll
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera roll is required!');
        return;
      }
  
      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        if (isPhoneImage) {
          setPhoneImageUri(result.assets[0].uri); // Set phone image URI
        } else {
          setImageUri(result.assets[0].uri); // Set property image URI
        }
      }
    } catch (error) {
      console.error('Error picking image: ', error);
      Alert.alert('Error picking image. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={34} color="white" />
        </TouchableOpacity>
        <View style={styles.topBarTextContainer}>
          <Text style={styles.TopBar}>Add</Text>
          <Text style={styles.TopBar1}>Property</Text>
        </View>
      </View>
      <ScrollView style={styles.formbackground}>
        <View style={styles.formContainer}>
          <View style={isMobile ? null : styles_web.form}>
            <View style={styles.addressLabelContainer}>
              {/* Image Upload Section */}
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => selectImage(false)}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.propertyImage} />
                  ) : (
                    <View style={[styles.placeholderImage, { borderColor: errors.imageUri ? 'red' : '#ccc' }]}>
                  <Icon name="camera-outline" size={50} color="#999" />
                </View>
                  )}
                  <View style={styles.plusIconContainer}>
                    <Icon name="add-circle" size={30} color="#007BFF" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ top: 15 }}>
                {/* Recycle Type Picker */}
                <View style={styles.LableContainer}>
                  <Text style={styles.label}>Recycle Type :</Text>
                </View>
                <View style={[styles.pickerContainer, errors.type && styles.inputError]}>
                  <Picker
                    selectedValue={type}
                    onValueChange={(itemValue) => setType(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a recycle type" value="" />
                    <Picker.Item label="Apartments" value="Apartments" />
                    <Picker.Item label="Furniture" value="Furniture" />
                    <Picker.Item label="Electronic" value="Electronic" />

                  </Picker>
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

                {/* Name Input */}
                <View style={styles.LableContainer}>
                  <Text style={styles.label}>Property Name :</Text>
                </View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={[styles.inputBox, errors.price && styles.inputError]}
                  placeholder="Enter name"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Price Input */}
                <View style={styles.LableContainer}>
                  <Text style={styles.label}>Price :</Text>
                </View>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  style={[styles.inputBox, errors.price && styles.inputError]}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Description Input */}
                <View style={styles.LableContainer}>
                  <Text style={styles.label}>Description :</Text>
                </View>
                <TextInput
                  value={propertyDescription}
                  onChangeText={setPropertyDescription}
                  style={[styles.inputBox, errors.propertyDescription && styles.inputError]}
                  placeholder="Description"
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.ButtonContainer}>
                  <TouchableOpacity style={styles.button} onPress={submitProperty} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Property'}</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    marginTop: 7,
    fontWeight: '900',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  TopBar: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    fontSize: 41,
    color: colors.white,
    fontWeight: 'bold',
    top:-10
  },
  TopBar1: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    fontSize: 41,
    color: colors.white,
    fontWeight: 'bold',
    top:-19
   
  },
  topBarTextContainer: {
    flexDirection: 'column', // Ensure the text is displayed in a column
    alignItems: 'center',    // Center the text horizontally
    justifyContent: 'center',// Center the text vertically
    marginLeft:185,
  },
  formbackground: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  formContainer: {
    width: '100%',
    padding: 20, // Added padding for better appearance
    top:-20
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
    paddingTop: 4,
    margin: 15,
  },
  ButtonContainer: {
    flex: 1,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginVertical: 2, // Adds spacing around the image container
  },
  propertyImage: {
    width: 120,
    height: 120,
    borderRadius: 20, // Rounded edges
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#E2E2E2', // Light grey background for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:3
    
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -10,  // Position at the bottom right of the image
    right: -10, 
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
  },
  inputBox: {
    height: 50,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderColor: '#567FE8',
    fontSize: 18,
    borderRadius: 10,
    backgroundColor: '#F7F9FF',
    top:-6
  },
  thirdInput: {
    flex: 1,
    marginHorizontal: 14,
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 2,
    backgroundColor: '#F7F9FF',
    borderColor: '#567FE8',
    borderRadius: 10,
    margin: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    width: 292,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002C9D',
    borderRadius: 15,
    marginBottom:20
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
    top:-8
  },
  inputError: {
    borderColor: 'red',
  },
});

export default AddProperty;
