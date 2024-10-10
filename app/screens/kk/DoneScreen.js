import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../Utils/colors';

function DoneScreen({ navigation, route }) {

  const {email} = route.params;

  const handleDone = () => {
    // Navigate to your desired screen after the success screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.successText}>Success!</Text>
      </View>
      <LottieView
        source={require('../../assets/success.json')} // Place the animation file in your assets folder
        autoPlay
        loop={false}
        style={styles.animation}
      />

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>Your Problem directed to </Text>
        <Text style={styles.description}>the team</Text>
        <Text style={styles.description2} >They will look into it</Text>
        <Text style={styles.description2}>  immediately</Text>
      </View>
      <View>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('MaintenanceAdd',{email:email})}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerContainer:{
    backgroundColor:colors.primary,
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderBottomLeftRadius:122,
    borderBottomRightRadius:122,
  },
  animation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: 20,
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    marginBottom:40,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer:{
    width:250,
    alignItems:'center',
    alignSelf:'center',
    paddingTop :0,
    paddingBottom:50,
  },
  description:{
    fontSize:21,
  },
  description2:{
    fontSize:17,
  }
});

export default DoneScreen;
