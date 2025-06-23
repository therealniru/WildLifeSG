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


export type { LoggedInStackParamList, LoggedOutStackParamList };