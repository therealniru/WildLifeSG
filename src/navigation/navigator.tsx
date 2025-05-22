import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  AddSpotting  from '../screens/AddSpotting';
import  ViewSightings  from '../screens/ViewSightings';
import type { LoggedInStackParamList, LoggedOutStackParamList } from '../types/stack';

const LoggedInStack = createNativeStackNavigator<LoggedInStackParamList>();
const LoggedOutStack = createNativeStackNavigator<LoggedOutStackParamList>();

const LoggedInNavigator = () => {
    return (
        <LoggedInStack.Navigator>
            <LoggedInStack.Screen name="Home" component={HomeScreen} />  
            <LoggedInStack.Screen name="AddSpotting" component={AddSpotting} />
            <LoggedInStack.Screen name="ViewSightings" component={ViewSightings} />
        </LoggedInStack.Navigator>
    )
}
// navigation, route are implicitly passed to the screen component as props
// destructuring them in the function signature is a common practice in React Navigation

const LoggedOutNavigator = () => {
    return (
        <LoggedOutStack.Navigator>
            <LoggedOutStack.Screen name="Login" component={Login} />
        </LoggedOutStack.Navigator>
    )
}

export { LoggedInNavigator, LoggedOutNavigator };