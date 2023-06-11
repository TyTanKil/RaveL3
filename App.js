import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './components/Home';
import RecordScreen from './components/Record';
import RaveScreen from './components/Rave';

const Tab = createBottomTabNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />),}}
        />
        <Tab.Screen name="Record" component={RecordScreen} options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="recording-outline" size={size} color={color} />
              ),}}
        />
        <Tab.Screen name="Rave" component={RaveScreen} options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="musical-notes-outline" size={size} color={color} />
              ),}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
