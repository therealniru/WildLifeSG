import React from 'react';
import { View, ToastAndroid } from 'react-native';
import Map from '../components/Map';
import ActionButton from '../components/ActionButton';
import { useLocation } from '../hooks/useLocation';
import tw from 'twrnc';

const HomeScreen = () => {
  const { location, hasPermission, requestPermission } = useLocation();

  const handleViewSpottings = () => {
    ToastAndroid.show('Viewing wildlife spottings...', ToastAndroid.SHORT);
  };

  const handleAddSpotting = () => {
    if (!hasPermission) {
      ToastAndroid.show('Location permission needed to add spotting', ToastAndroid.LONG);
      requestPermission();
      return;
    }
    ToastAndroid.show('Adding new spotting...', ToastAndroid.SHORT);
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
