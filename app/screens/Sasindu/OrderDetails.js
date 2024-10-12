import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Platform, StatusBar, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore'; 
import { DB } from '../../config/DB_config'; 
import Icon from 'react-native-vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../../Utils/colors';

function OrderDetails({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigation();

    const fetchOrders = useCallback(async () => {
        try {
            const ordersRef = collection(DB, "orderDetails");
            const querySnapshot = await getDocs(ordersRef);
            const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchOrders();
        }, [fetchOrders])
    );

    // PDF Generation Function
    const generateOrderPDF = async () => {
        try {
            const html = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                background-color: #f4f4f4;
                            }
                            h1 {
                                text-align: center;
                                color: #567FE8;
                            }
                            h2 {
                                text-align: center;
                                color: #333;
                            }
                            .date {
                                text-align: right;
                                color: #333;
                                font-size: 14px;
                                margin-top: -30px; /* Adjust positioning */
                                margin-bottom: 20px; /* Space below the date */
                                margin-right: 20px; /* Right margin */
                                }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                                background-color: #fff;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 12px;
                                text-align: left;
                            }
                            th {
                                background-color: #567FE8;
                                color: white;
                            }
                            tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                            .footer {
                                margin-top: 30px;
                                text-align: center;
                                font-size: 12px;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Order Report</h1>
                        <div class="date">Date : ${new Date().toLocaleDateString()}</div> <!-- Current date -->
                        <table>
                            <tr>
                                <th>Customer Name</th>
                                <th>Address</th>
                                <th>Mobile</th>
                                <th>Properties</th>
                                <th>Total Amount</th>
                            </tr>
                            ${orders.map(order => `
                                <tr>
                                    <td>${order.name}</td>
                                    <td>${order.address}</td>
                                    <td>${order.num}</td>
                                     <td>
                                        ${order.cartItems.map(cartItem => `${cartItem.name}`).join(', ')}
                                    </td>
                                    <td>LKR ${order.totalAmount}</td>
                                </tr>
                            `).join('')}
                        </table>
                        <div class="footer">© ${new Date().getFullYear()} MM-Management. All rights reserved.</div>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Error generating PDF:", error);
            Alert.alert("Failed to generate PDF. Please try again.");
        }
    };

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

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back-outline" size={34} color="white" />
                </TouchableOpacity>
                
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar}>Order</Text>
                    <Text style={styles.TopBar1}>Details</Text>
                </View>
            </View>
            <View style={styles.formBackground}>
            
                {loading ? (
                    <ActivityIndicator size="large" color="#567FE8" style={styles.loadingIndicator} />
                ) : (
                    <>
                        <FlatList
                            data={orders}
                            renderItem={renderOrder}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                        />
                         <View style={styles.pdfbtn}>
                            <TouchableOpacity onPress={generateOrderPDF} style={styles.pdfIconButton}>
                                <View style={styles.pdfIconContainer}>
                                    <Icon name="document-text-outline" size={30} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
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
    backButton: {
        position: 'absolute',
        left: 14,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:-15
      },
      TopBar1: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:-22
       
      },
      topBarTextContainer: {
        flexDirection: 'column', // Ensure the text is displayed in a column
        alignItems: 'center',    // Center the text horizontally
        justifyContent: 'center',// Center the text vertically
        marginLeft:220,
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
        marginRight: 10,
        padding: 10,
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
        fontSize: 16,
    },
    cartItemPrice: {
        fontSize: 14,
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

export default OrderDetails;
