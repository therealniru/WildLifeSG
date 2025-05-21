import { View, ToastAndroid } from 'react-native';
import Map from '../components/Map';
import ActionButton from '../components/ActionButton';
import { useLocation } from '../hooks/useLocation';
import { useLayoutEffect } from 'react';
import { Button } from 'react-native';

import tw from 'twrnc';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  ViewSightings: undefined;
  AddSpotting: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
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

  const signOut = () => {
    // Sign out logic here
    ToastAndroid.show('Signing out...', ToastAndroid.SHORT);
    auth.signOut()
  }

  const handleViewSpottings = () => {
    ToastAndroid.show('Viewing wildlife spottings...', ToastAndroid.SHORT);
    navigation.navigate('ViewSightings');
  };

  const handleAddSpotting = () => {
    if (!hasPermission) {
      ToastAndroid.show('Location permission needed to add spotting', ToastAndroid.LONG);
      requestPermission();
      return;
    }
    ToastAndroid.show('Adding new spotting...', ToastAndroid.SHORT);
    navigation.navigate('AddSpotting');
  };

  return (
    <View style={tw`flex-1`}>

      <Map location={location} hasPermission={hasPermission} />

      <View style={tw`absolute bottom-5 left-5 right-5 flex-col space-y-2`}>
        
        <ActionButton
          title="View Wildlife Spottings"
          onPress={handleViewSpottings}
          color="#2196F3"
        />
        <ActionButton
          title="Add New Spotting"
          onPress={handleAddSpotting}
          color="#4CAF50"
        />
      </View>

    </View>
  );
};

export default HomeScreen;
