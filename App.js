import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/telas/Home/HomeScreen';
import CameraScreen from './src/telas/Camera/CameraScreen';

const StackNavigator = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator initialRouteName='HomeScreen'>
      <StackNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <StackNavigator.Screen name="CameraScreen" component={CameraScreen} />

      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});