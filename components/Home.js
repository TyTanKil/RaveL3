import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

  const navigation = useNavigation();

  const [serverAddress, setServerAddress] = useState('192.168.1.235');
  const [serverPort, setServerPort] = useState('8000');
  
  const connexion = () => {
    axios
      .get(`http://${serverAddress}:${serverPort}`)
      .then(() => {
        alert("Connexion réussie !");
        navigation.navigate('Record');
      })
      .catch((error) => {
        console.log(error);
        alert("La connexion a échoué");
      });
  };
      
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }} placeholder='Adresse IP...' value={serverAddress} onChangeText={setServerAddress}></TextInput>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }} placeholder='Port : '  value={serverPort} onChangeText={setServerPort}></TextInput>
      <Button title="Connexion" onPress={connexion}>Se Connecter</Button>
    </View>
  );
};

export default HomeScreen;
