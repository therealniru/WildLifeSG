import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  AddSpotting  from '../screens/AddSpotting';
import  ViewSightings  from '../screens/ViewSightings';

const LoggedInStack = createNativeStackNavigator();
const LoggedOutStack = createNativeStackNavigator();

const LoggedInNavigator = () => {
    return (
        <LoggedInStack.Navigator>
            <LoggedInStack.Screen name="Home" component={HomeScreen} />
            <LoggedInStack.Screen name="AddSpotting" component={AddSpotting} />
            <LoggedInStack.Screen name="ViewSightings" component={ViewSightings} />
        </LoggedInStack.Navigator>
    )
}

const LoggedOutNavigator = () => {
    return (
        <LoggedOutStack.Navigator>
            <LoggedOutStack.Screen name="Login" component={Login} />
        </LoggedOutStack.Navigator>
    )
}

export { LoggedInNavigator, LoggedOutNavigator };