import { View, ToastAndroid, ImageBackground, StyleSheet } from 'react-native';
//import Map from '../components/Map';
import ActionButton from '../components/ActionButton';
import { useLocation } from '../hooks/useLocation';
import { useLayoutEffect } from 'react';
import { Button } from 'react-native';

import tw from 'twrnc';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

import type { HomeScreenProps } from '../types/stack';

//destructures 1st field (navigation) from props as navigation
const HomeScreen = ( {navigation} : HomeScreenProps) => {  
  const { location, hasPermission, requestPermission } = useLocation();
  const auth = FIREBASE_AUTH;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Sign Out"
          onPress={signOut}
          color="#FF3B30"
        />
      ),
    });
  }, [navigation]);   

  // useLayoutEffect is used to set the header options (signout button) when the component mounts

  const signOut = () => {
    ToastAndroid.show('Signing out...', ToastAndroid.SHORT);
    auth.signOut()
  }

  const handleViewSpottings = () => {
    ToastAndroid.show('Viewing wildlife spottings...', ToastAndroid.SHORT);
    navigation.navigate('ViewSightings');
  };

  const handleAddSpotting = () => {
    if (!hasPermission) {
      ToastAndroid.show('Location permission needed to add spotting', ToastAndroid.SHORT);
      requestPermission();
      return;
    }
    ToastAndroid.show('Opening Add Spotting...', ToastAndroid.SHORT);
    navigation.navigate('AddSpotting');
  };

  const handleUserSightings = () => {
    ToastAndroid.show('Viewing your wildlife spottings...', ToastAndroid.SHORT);
    navigation.navigate('UserSightings');
  }

  return (
    <ImageBackground
      source={require('../../assets/homepage-bg.png')}
      style={tw`flex-1`}
      resizeMode="stretch">
    <View style={tw`flex-1`}>
      {/*Below is the map component initially in the homepage, but commented out for now*/}
      {/*<Map location={location} hasPermission={hasPermission} />*/}

      <View style={tw`absolute bottom-60 left-7 right-7 flex-col space-y-2`}>
        
        <ActionButton
          title="View Wildlife Sightings"
          onPress={handleViewSpottings}
          color="#006400"
        />
        <ActionButton
          title="Add New Spotting"
          onPress={handleAddSpotting}
          color="#006400"
        />
        <ActionButton
          title="User Sightings"
          onPress={handleUserSightings}
          color="#006400"
        />
      </View>

    </View>
    </ImageBackground>
  );
};

export default HomeScreen;
