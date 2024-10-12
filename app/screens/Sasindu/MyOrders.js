import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native'; // Import useRoute for accessing params
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { DB } from '../../config/DB_config'; 
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyOrders({navigation}) {
    const route = useRoute(); // Accessing route
    const { email } = route.params || {}; 
    console.log('Received email marketplace:', email);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigation();
    const [cartItems, setCartItems] = useState([]); // State to hold cart items

    // Fetch orders with email filtering
    const fetchOrders = useCallback(async () => {
        try {
            const ordersRef = collection(DB, "orderDetails");
            const q = query(ordersRef, where("email", "==", email)); // Query to filter by email
            const querySnapshot = await getDocs(q);
            const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [email]); // Add email as a dependency

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchOrders();
        }, [fetchOrders])
    );
    useEffect(() => {
        const updateCartCount = async () => {
          const storedCartItems = await AsyncStorage.getItem('cartItems');
          const updatedCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
          setCartItems(updatedCartItems); // Set the updated cart items state
        };
    
        const unsubscribe = navigation.addListener('focus', updateCartCount);
        return unsubscribe; // Clean up the listener on unmount
      }, [navigation]);

    const renderCartItem = ({ item: cartItem }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: cartItem.imageUrl || 'https://via.placeholder.com/80' }} style={styles.cartItemImage} />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{cartItem.name}</Text>
                <Text style={styles.cartItemPrice}>Price: LKR {cartItem.price}</Text>
            </View>
        </View>
    );

    const renderOrder = ({ item }) => (
        <View style={styles.orderItem}>
            <View style={styles.orderDetails}>
                <Text style={styles.orderName}>{item.name}</Text>
                <Text style={styles.orderAddress}>{item.address}</Text>
                <Text style={styles.orderNum}>Mobile: {item.num}</Text>
                <FlatList
                    data={item.cartItems}
                    keyExtractor={(cartItem) => cartItem.id}
                    renderItem={renderCartItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cartItemContainer}
                />
                <Text style={styles.orderAmount}>Total Amount: LKR {item.totalAmount}</Text>
            </View>
        </View>
    );

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
          <Text style={styles.TopBar1}>My Orders</Text>
        </View>
            </View>
            <View style={styles.formBackground}>
                {loading ? (
                    <ActivityIndicator size="large" color="#567FE8" style={styles.loadingIndicator} />
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={renderOrder}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#567FE8',
        width: '100%',
    },
    TopBarContainer: {
        backgroundColor: '#567FE8',
        flex: 0.15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
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
    formBackground: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        padding:20,
        marginBottom:-30
        
    },
    loadingIndicator: {
        marginTop: 30,
    },
    listContainer: {
        top:1,
    },
    orderItem: {
        backgroundColor: '#F1F4FF',
        borderRadius: 15,
        marginBottom: 10,
        padding: 18,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    orderDetails: {
       flex:1
        
    },
    orderName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    orderAddress: {
        fontSize: 14,
        marginBottom: 1,
    },
    orderNum: {
        fontSize: 14,
        marginBottom: 5,
    },
    cartItemContainer: {
        paddingVertical: 1,
    },
    cartItem: {
        flexDirection: 'column',
        alignItems: 'center',
        padding:10,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    cartItemImage: {
        width: 80,
        height: 80,
       
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 14,
    },
    cartItemPrice: {
        fontSize: 12,
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 6,
    },
    pdfbtn: {
        alignItems:'flex-end',
        top:-10,
    },
    pdfIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 30,
        backgroundColor: colors.btn,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
},
});

export default MyOrders;
