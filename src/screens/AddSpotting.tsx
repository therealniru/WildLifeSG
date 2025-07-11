import { useCallback, useEffect, useState } from 'react';
import { View, Button, TextInput, Modal, Image, StyleSheet, ToastAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, push, set } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { useImagePicker } from '../hooks/useImagePicker';
//import * as Location from 'expo-location';
import { useLocation } from '../hooks/useLocation';
import DisplayModal from '../components/DisplayModal';

interface Sighting {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
  photoUrl: string;
  timestamp: number;
}

const AddSpotting = () => {
  // Modal visibility, form fields, and marker coordinates
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  //const [location, setLocation] = useState<any>(null);

  // Request location permission and get current location on mount
  // This will set the initial region of the map to the user's current location
  
  const { location, hasPermission } = useLocation();

  // Use the custom image picker hook
  const { photoUri, pickImage, takePhoto, clearPhoto } = useImagePicker();

  // When the user taps on the map, open the modal to add details and photo
  const onMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCoords({ lat: latitude, lng: longitude });
    setModalVisible(true);
  };

  // Add the sighting to the Realtime Database
  const addMarker = async () => {
    // Validate all fields
    if (!coords || !photoUri || !name || !desc) {
      ToastAndroid.show('Please fill in all fields and add a photo', ToastAndroid.SHORT);
      return;
    }
    try {
      // Get the current user
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        ToastAndroid.show('You must be logged in to add a sighting', ToastAndroid.SHORT);
        return;
      }
      // Push the new sighting to the database
      const newSightingRef = push(ref(db, 'sightings'));
      await set(newSightingRef, {
        userId: user.uid,
        name,
        desc,
        lat: coords.lat,
        lng: coords.lng,
        photoUrl: photoUri, // Store the base64 image string
        timestamp: Date.now(),
      });
      setSightings((prev) => [
        ...prev,
        {
          id: newSightingRef.key || '',
          name,
          desc,
          lat: coords.lat,
          lng: coords.lng,
          photoUrl: photoUri,
          timestamp: Date.now(),
        },
      ]);
      // Reset form and state
      setModalVisible(false);
      setName('');
      setDesc('');
      setCoords(null);
      clearPhoto();
      ToastAndroid.show('Sighting added!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error adding sighting:', error);
      ToastAndroid.show('Failed to add sighting', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map for selecting the sighting location */}
      <MapView
        style={{ flex: 1 }}
        onPress={onMapPress}
        showsUserLocation={true}
        initialRegion={location}
        provider = "google"
      >
        {/* Show marker if coordinates are selected */}
        {coords && (
          <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} />
        )}
        {sightings.map(sighting => (
          <Marker
            key={sighting.id}
            coordinate={{ latitude: sighting.lat, longitude: sighting.lng }}
            onPress={() => setSelectedSighting(sighting)}
          />
        ))}
      </MapView>
      {/* Modal for entering sighting details and picking/taking a photo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          clearPhoto();
          setCoords(null);
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            {/* Show photo preview if available, else show buttons to pick/take photo */}
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Button title="Take Photo" onPress={takePhoto} />
                <Button title="Pick from Gallery" onPress={pickImage} />
              </View>
            )}
            {/* Name and description input fields */}
            <TextInput
              placeholder="Wildlife Species"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Description/Location"
              value={desc}
              onChangeText={setDesc}
              style={styles.input}
            />
            {/* Add and Cancel buttons */}
            <Button title="Add Sighting" onPress={addMarker} />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                clearPhoto();
                setCoords(null);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Display modal for selected sighting details */}
      {selectedSighting && (
        <DisplayModal
          visible={!!selectedSighting}
          sighting={selectedSighting}
          onClose={() => setSelectedSighting(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default AddSpotting;