import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; 
import colors from '../../Utils/colors';

function Cart({ navigation, route }) {
  const { email, clearCart } = route.params || {};  // Destructure clearCart param if it exists
  console.log('Received email marketplace:', email);
  
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (clearCart) {
        // Clear the cart items from AsyncStorage and state if clearCart is true
        await AsyncStorage.removeItem('cartItems');
        setCartItems([]);
      } else {
        // Fetch and filter cart items from AsyncStorage
        const storedCartItems = await AsyncStorage.getItem('cartItems');
        console.log('Stored Cart Items:', storedCartItems);
        if (storedCartItems) {
          const parsedCartItems = JSON.parse(storedCartItems);
          const filteredItems = await Promise.all(parsedCartItems.map(async (item) => {
            const normalizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
            const docId = `${normalizedEmail}_${item.name}`;
            const docRef = doc(DB, 'cartItems', docId);
            const docSnap = await getDoc(docRef);
            
            return docSnap.exists() ? item : null;
          }));
          
          setCartItems(filteredItems.filter(item => item !== null));
        }
      }
    };

    fetchCartItems();
  }, [email, clearCart]);

  const handleRemoveItem = async (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Rs : {item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
        <Icon name="remove-circle" size={30} color="#002C9D" />
      </TouchableOpacity>
    </View>
  );

  // Calculate the total amount
  const totalAmount = cartItems.reduce((total, item) => total + Number(item.price), 0);

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
          </View>
        </View>
        <View style={styles.topBarTextContainer}>
          <Text style={styles.TopBar1}>E-Cart</Text>
        </View>
      </View>
      <View style={styles.cartContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Your cart is empty...</Text>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>Rs : {totalAmount}</Text>
      </View>
      <View style={{ backgroundColor: 'white' }}>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('placeOrder', { cartItems, totalAmount })}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2.2 : 0,
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
  cartContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: 55,
    paddingHorizontal: 36,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    padding: 20,
    marginTop: 50,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F1F4FF',
    padding: 10,
    borderRadius: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#888',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  removeButton: {
    padding: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#002C9D',
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 39,
    borderRadius: 10,
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
