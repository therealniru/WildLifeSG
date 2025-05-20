/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import HomeScreen from './src/screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
