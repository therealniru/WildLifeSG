import { Text, View, ToastAndroid, ImageBackground, StyleSheet, Image } from 'react-native';
//import Map from '../components/Map';
import ActionButton from '../components/ActionButton';
import { useLocation } from '../hooks/useLocation';
import { use, useLayoutEffect } from 'react';
import { Button } from 'react-native';
import tw from 'twrnc';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoggedInStackParamList } from '../types/stack';  // import the type for the navigation stack params


type HomeScreenProps = NativeStackScreenProps<LoggedInStackParamList, 'Home'>;  
// providing a type for navigation prop in HomeScreen component (since we are using typescript)
// this is used in HomeScreen.tsx to destructure navigation from props

//destructures 1st field (navigation) from props as navigation
const HomeScreen = ( {navigation} : HomeScreenProps) => {  
  const { location, hasPermission, requestPermission } = useLocation();

  //const userLocation = useSelfLocation();   // called here to avid delay in AddSpotting screen
  const auth = FIREBASE_AUTH;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Sign Out"
          onPress={signOut}
          color="#023d0dff"
        />
      ),
    });
  }, [navigation]);   

  // useLayoutEffect is used to set the header options (signout button) when the component mounts

  const signOut = () => {
    //ToastAndroid.show('Signing out...', ToastAndroid.SHORT);
    Toast.show({
      type: "info",
      text1: "Singing out...",
      position: "bottom",
      visibilityTime: 1500
    })
    auth.signOut()
  }

  const handleViewSpottings = () => {
    //ToastAndroid.show('Viewing wildlife spottings...', ToastAndroid.SHORT);
    Toast.show({
        type: "info",
        text1: 'Viewing wildlife spottings...',
        position: "bottom",
        visibilityTime: 2000
    })
    navigation.navigate('ViewSightings');
  };

  const handleAddSpotting = () => {
    if (!hasPermission) {
      //ToastAndroid.show('Location permission needed to add spotting', ToastAndroid.SHORT);
      Toast.show({
        type: "info",
        text1: 'Location permission needed to add spotting',
        position: "bottom",
        visibilityTime: 2000
      })
      requestPermission();
      return;
    }
    //ToastAndroid.show('Opening Add Spotting...', ToastAndroid.SHORT);
     Toast.show({
      type: "info",
      text1: "Let's add some Sightings!",
      position: "bottom",
      visibilityTime: 2000
    });
    navigation.navigate('AddSpotting');
  };

  const handleUserSightings = () => {
    //ToastAndroid.show('Viewing your wildlife spottings...', ToastAndroid.SHORT);
    Toast.show({
      type: "info",
      text1: 'Viewing your wildlife spottings...',
      position: "bottom",
      visibilityTime: 2000
    });
    navigation.navigate('UserSightings');
  }

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={tw`flex-1`}
      resizeMode="stretch">
    <View style={tw`flex-1 items-center mt-10`}>
      {/*Below is the map component initially in the homepage, but commented out for now*/}
      {/*<Map location={location} hasPermission={hasPermission} />*/}
      <Text style = {tw`text-6xl font-bold mb-1 text-[#e8eac5] mt-1`}>SGWildlife</Text>
      <Text style = {tw`text-sm mb--40 text-white`}>Let Us Take Wildlife Spotting To The Next Level</Text>
      {/* <Image source = {require("../../assets/parrot.png")} style = {tw`w-40 h-40 mt-46 ml-48 z-10 `} resizeMode = "contain"/> */}
      <View style={tw`absolute bottom-60 left-7 right-7 flex-col space-y-2`}>
        <Image source = {require("../../assets/parrot.png")} style = {tw`w-35 h-35 absolute -top-25 right-0 z-10 `} resizeMode = "contain"/>
        <ActionButton
          title="View Wildlife Sightings"
          onPress={handleViewSpottings}
          color="#e8eac5" 
          icon = {require("../../assets/location-icon.png")}
        />
        <ActionButton
          title="Add New Spotting"
          onPress={handleAddSpotting}
          color="#e8eac5"
          icon = {require("../../assets/plus-icon.png")}
        />
        <ActionButton
          title="My Sightings"
          onPress={handleUserSightings}
          color="#e8eac5"
          icon = {require("../../assets/user-icon.png")}
        />
      </View>

    </View>
    </ImageBackground>
  );
};

export default HomeScreen;

// only changed "user sightings" to "My sightings" in 2 places 
            // the title of the screen in navigator.tsx and
            // button name in homescreen
            // only for user display, file names are all still "UserSightings"
