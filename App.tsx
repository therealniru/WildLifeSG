import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { LoggedInNavigator, LoggedOutNavigator } from './src/navigation/navigator';
import Toast, {BaseToast, ToastProps} from 'react-native-toast-message';

// toastConfig for customized style of toast messages
const toastConfig = {
  info: (props: ToastProps)  => (
    <BaseToast
      {...props}
      text1Style = {{
        fontSize: 16,
        fontWeight: 'bold'
      }}
      text2Style = {{
        fontSize: 16,
        fontWeight: 'bold'
      }}
    />
    ),
};

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log("User state changed", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={LoggedInNavigator} />  // component is a navigator with multiple screens
        ) : (
          <Stack.Screen name="Login" component={LoggedOutNavigator} />
        )}
      </Stack.Navigator>
      <Toast config = {toastConfig}/>
    </NavigationContainer>
  );
}

export default App;

//TODO

// wrap loading in {}, parent element 
// authstatechange
// nav container
// component can be a bunch of screens 

// create sign out from logged in stack
// naviagte to screen from buttons