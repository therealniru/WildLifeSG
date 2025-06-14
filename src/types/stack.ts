import { NativeStackScreenProps } from '@react-navigation/native-stack';

type LoggedInStackParamList = {
    Home: undefined;
    AddSpotting: undefined;
    ViewSightings: undefined;
    UserSightings: undefined;
};
// list of screens in the logged in stack

type LoggedOutStackParamList = {
    Login: undefined;
};
// list of screens in the logged out stack

type HomeScreenProps = NativeStackScreenProps<LoggedInStackParamList, 'Home'>;  
// providing a type for navigation prop in HomeScreen component (since we are using typescript)
// this is used in HomeScreen.tsx to destructure navigation from props

export type { LoggedInStackParamList, LoggedOutStackParamList, HomeScreenProps };