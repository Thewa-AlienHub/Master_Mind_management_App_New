import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, StatusBar, TouchableOpacity, Text, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Import your Firestore config
import AsyncStorage from '@react-native-async-storage/async-storage';

function SelectedItemView({ route, navigation }) {
  const { email } = route.params || {}; 
  console.log('Received email marketplace:', email);

  const { propertyId } = route.params; // Get propertyId from route params
  const [property, setProperty] = useState(null); // State to hold property data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyDoc = await getDoc(doc(DB, 'properties', propertyId)); // Fetch property by ID
        if (propertyDoc.exists()) {
          setProperty(propertyDoc.data()); // Set the fetched property data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching property: ', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProperty();
  }, [propertyId]); // Fetch property details when component mounts

  if (loading) {
    // Show a loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#567FE8" />
        <Text>Loading property...</Text>
      </View>
    );
  }

  const addItemToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cartItems');
      const updatedCart = existingCart ? JSON.parse(existingCart) : [];
  
      // Check if the item is already in the cart in local storage
      const isItemInCart = updatedCart.some(item => item.id === propertyId);
      if (isItemInCart) {
        Alert.alert('That Property is not available.');
        return;
      }

      const itemWithId = { ...property, id: propertyId }; // Add propertyId as the id
      updatedCart.push(itemWithId);
  
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      console.log('Item added to cart:', itemWithId);
      
      // Save the property details to Firestore as well, including the email
      await savePropertyToFirestore(itemWithId, email); // Call the function to save to Firestore with email
      
      navigation.navigate('cart', { email }); 
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Function to save the property details to Firestore
  const savePropertyToFirestore = async (propertyData, userEmail) => {
    try {
      // Normalize the email by removing special characters and spaces, then combine with property name
      const normalizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
      const combinedId = `${normalizedEmail}_${propertyData.name}`; // Create a combined ID
      const property = { ...propertyData }; // Include email in the data
      
      const propertyRef = doc(DB, 'cartItems', combinedId); // Reference to the cart item document using the combined ID
      await setDoc(propertyRef, property); // Save property data to Firestore
      console.log('Property added to Firestore:', property);
    } catch (error) {
      console.error('Error saving property to Firestore:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.TopBarContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back-outline" size={34} color="white" />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.backButton}>
              <Icon name="notifications" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('cart', { email })} style={styles.backButton}>
              <Icon name="cart" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.topBarTextContainer}>
          <Text style={styles.TopBar}>{property ? property.name : 'Property'}</Text>
        </View>
      </View>

      <View style={styles.formBackground}>
        {property ? (
          <View style={styles.content}>
            <Image source={{ uri: property.imageUrl }} style={styles.propertyImage} />
            <Text style={styles.propertyTitle}>{property.name}</Text>
            <Text style={styles.propertyDescription}>{property.description}</Text>
            <Text style={styles.propertyPrice}>Rs: {property.price}</Text>
            <TouchableOpacity style={styles.cartButton} onPress={addItemToCart}>
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>No property data available.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#567FE8',
  },
  TopBarContainer: {
    backgroundColor: '#567FE8',
    flex: 0.12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
    position: 'relative',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 14,
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  backButton: {
    marginLeft: 8,
  },
  TopBar: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  topBarTextContainer: {
    alignItems: 'center',
  },
  formBackground: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 20,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    top: 30,
  },
  propertyImage: {
    width: 310,
    height: 260,
    borderRadius: 15,
    marginBottom: 40,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  propertyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002C9D',
    marginBottom: 30,
  },
  cartButton: {
    backgroundColor: '#002C9D',
    paddingVertical: 12,
    paddingHorizontal: 105,
    borderRadius: 10,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#567FE8',
  },
});

export default SelectedItemView;
