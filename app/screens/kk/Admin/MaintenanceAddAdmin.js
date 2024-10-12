import React from 'react';
import { View,StyleSheet,Text, Image,Switch,TouchableOpacity } from 'react-native';
import colors from '../../../Utils/colors';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

function MaintenanceAddAdmin({navigation}) {

    const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [collectionName, setCollectionName] = useState('ElectricalIssues');


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate('MaintenanceAdd')}>
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Maintenance</Text>
                <Text style={styles.header}>Admin</Text>
            </View>

            <View style={styles.FormContainer}>
            <View style={styles.CardRow}>
                        <View style={styles.CardColumn}>
                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'ElectricalIssues'})}>
                                    <Image source={require('../../../assets/electricle.png')}/>
                                    <Text style={{paddingTop:10}}>Electrical</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'PlumbingIssues'})}>
                                    <Image source={require('../../../assets/plumbing.png')}/>
                                    <Text style={{paddingTop:10}}>plumbing</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={styles.CardRow}>
                        <View style={styles.CardColumn}>
                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'ConstructionIssues'})}>
                                    <Image source={require('../../../assets/construction.png')}/>
                                    <Text style={{paddingTop:10}}>construction</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'FixedLineIssues'})}>
                                    <Image source={require('../../../assets/satelite.png')}/>
                                    <Text style={{paddingTop:10}}>Fixed Line</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={styles.CardRow}>
                        <View style={styles.CardColumn}>
                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'SecurityIsues'})}>
                                    <Image source={require('../../../assets/cctv.png')}/>
                                    <Text style={{paddingTop:10}}>Security</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.Card}>
                                <TouchableOpacity style={styles.CardIn} onPress={()=>navigation.navigate('ElectricalIssuesAdmin',{collectionName:'ACIssues'})}>
                                    <Image source={require('../../../assets/AC.png')}/>
                                    <Text style={{paddingTop:10}}>Air Condition</Text>
                                    <Text>Issues</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

            </View>



        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor: colors.primary,
    },
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for your needs
        left: 20, // Adjust for your needs
        zIndex: 1, // Make sure it's above the content
      },
      backButtonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
      },
    headerContainer:{
        paddingTop:70,
        alignItems:'center',
        paddingBottom:30,
    },
    header:{
        fontSize:40,
        color: colors.white,
        fontWeight:'bold',
    },
    FormContainer:{
        paddingTop:30,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        backgroundColor: colors.white,
        flex:1,
        elevation:50,
    },
    //card designs
    CardColumn:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        flex:1,
    },
    CardRow:{
        flexDirection:'column',
        flex:1/3,
        justifyContent:'space-evenlys',
    },
    Card:{
        borderWidth:0.5,
        borderColor: '#adabaa',
        justifyContent:'center',
        borderRadius:30,
        width:'40%',
        height: '80%',
        backgroundColor: colors.secondary,
        elevation:20,
    },
    CardIn:{
        alignItems:'center'
    }

   
})
export default MaintenanceAddAdmin;