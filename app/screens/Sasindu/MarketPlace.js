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
  TextInput, // Import TextInput for the search bar
} from 'react-native';
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MarketPlace({ navigation, route }) {
  const { email } = route.params || {};
  console.log('Received email marketplace:', email);

  const [properties, setProperties] = useState([]); // State to hold property data
  const [selectedType, setSelectedType] = useState(''); // State to hold selected filter type
  const [filteredProperties, setFilteredProperties] = useState([]); // State for filtered properties
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyCollection = await getDocs(collection(DB, 'properties'));
        const propertyData = propertyCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertyData); // Set properties state
        setFilteredProperties(propertyData); // Set filtered properties initially to all properties
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    const fetchCartItems = async () => {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      setCartItems(cartItems); // Set the cart items state
    };

    fetchProperties();
    fetchCartItems();
  }, []);

  useEffect(() => {
    const updateCartCount = async () => {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      const updatedCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      setCartItems(updatedCartItems); // Set the updated cart items state
    };

    const unsubscribe = navigation.addListener('focus', updateCartCount);
    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  // Function to filter properties based on selected type and search query
  const handleFilter = (type) => {
    setSelectedType(type);
    filterProperties(type, searchQuery); // Update the filtering logic to include the search query
  };

  // Function to filter properties based on both type and search query
  const filterProperties = (type, query) => {
    let filtered = properties;

    if (type !== '') {
      filtered = filtered.filter((property) => property.type === type);
    }

    if (query !== '') {
      filtered = filtered.filter((property) =>
        property.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  // Function to handle search input changes
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterProperties(selectedType, text); // Update filtering based on the search query
  };

  return (
    <View style={styles.container}>
      <View style={styles.TopBarContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back-outline" size={34} color="white" />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('addNotification')} style={styles.backButton}>
              <Icon name="notifications" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('cart', { email })} style={styles.backButton}>
              <Icon name="cart" size={30} color="white" />
              {cartItems.length > 0 && (
                <View style={styles.cartCountContainer}>
                  <Text style={styles.cartCountText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.topBarTextContainer}>
          <Text style={styles.TopBar1}>Marketplace</Text>
        </View>
      </View>

      <View style={styles.formbackground}>
         {/* Search Bar */}
         <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search properties..."
                placeholderTextColor="#567FE8" 
                value={searchQuery}
                onChangeText={handleSearch}
            />
            </View>
        <Text style={{ marginLeft: 22, fontSize: 18, fontWeight: 'bold', color: '#343434' }}>Category</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => handleFilter('')} style={styles.filterButton}>
            <View style={styles.iconCircle}>
              <Icon name="list-outline" size={30} color={selectedType === '' ? colors.btn : 'gray'} />
            </View>
            <Text style={styles.iconText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilter('Apartments')} style={styles.filterButton}>
            <View style={styles.iconCircle}>
              <Icon name="home-outline" style={{ fontWeight: '900' }} size={30} color={selectedType === 'Apartments' ? colors.btn : 'gray'} />
            </View>
            <Text style={styles.iconText}>Apartments</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilter('Furniture')} style={styles.filterButton}>
            <View style={styles.iconCircle}>
              <Icon name="bed-outline" size={30} color={selectedType === 'Furniture' ? colors.btn : 'gray'} />
            </View>
            <Text style={styles.iconText}>Furniture</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilter('Electronic')} style={styles.filterButton}>
            <View style={styles.iconCircle}>
              <Icon name="tv-outline" size={30} color={selectedType === 'Electronic' ? colors.btn : 'gray'} />
            </View>
            <Text style={styles.iconText}>Electronic</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {filteredProperties.length > 0 ? (
            <View style={styles.cardContainer}>
              {filteredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('view', { email, propertyId: property.id })} // Navigate on card press
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
          ) : (
            <Text style={styles.noResultsText}>No properties found</Text>
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
    top: 45
  },
  cartCountContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  notificationCountContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
},
notificationCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
},
  rightButtons: {
    flexDirection: 'row',
  },
  backButton: {
    marginLeft: 8,
  },
  TopBar1: {
    fontSize: 34,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#D6E2FF',
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconText: {
    fontSize: 14,
    color: '#575757',
    fontWeight:'bold'
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    top: 20,
    marginBottom: 50,
  },
  card: {
    backgroundColor: '#EFF3FF',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 3,
    width: '48%',
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
    padding: 1,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    alignItems: 'center',
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
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    backgroundColor:'#D1DEFF',
    
  },
  searchInput: {
    flex: 1, // Take up the remaining space
    height: 49,
    paddingLeft: 10,
    fontWeight:'bold',
  },
  searchIcon: {
    marginRight: 6, // Space between the icon and text input
    color:'#567FE8',
    marginLeft:20
  },
});

export default MarketPlace;
