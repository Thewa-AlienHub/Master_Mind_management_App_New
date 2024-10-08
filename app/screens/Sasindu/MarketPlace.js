import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config';

function MarketPlace({ navigation }) {
  const [properties, setProperties] = useState([]); // State to hold property data

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyCollection = await getDocs(collection(DB, 'properties'));
        const propertyData = propertyCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertyData); // Set properties state
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    fetchProperties();
  }, []); // Fetch properties on component mount

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
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.backButton}>
              <Icon name="cart" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.topBarTextContainer}>
          <Text style={styles.TopBar1}>Marketplace</Text>
        </View>
      </View>
      <View style={styles.formbackground}>
        <ScrollView>
          {properties.length > 0 && (
            <View style={styles.cardContainer}>
              {properties.map((property) => (
                <TouchableOpacity 
                  key={property.id} 
                  style={styles.card} 
                  onPress={() => navigation.navigate('view', { propertyId: property.id })} // Navigate on card press
                >
                  <Image source={{ uri: property.imageUrl }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{property.name}</Text>
                    <Text style={styles.cardDescription}>{property.description}</Text>
                    <Text style={styles.cardPrice}>LKR {property.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
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
    flexDirection: 'column',
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
  TopBar1: {
    fontSize: 41,
    color: colors.white,
    fontWeight: 'bold',
    top: -19,
  },
  topBarTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formbackground: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 22,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjusts space between cards
    top: 20,
    marginBottom:50
  },
  card: {
    backgroundColor: '#EFF3FF',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal:3,
    width: '48%', // Adjust width for two cards per row
    padding: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    padding:1,
    alignItems:'center'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    alignItems:'center'
  },
  cardDescription: {
    fontSize: 12,
    marginVertical: 5,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#002C9D',
  },
});

export default MarketPlace;
