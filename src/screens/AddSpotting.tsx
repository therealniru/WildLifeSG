import { useCallback, useEffect, useState } from 'react';
import { View, Button, TextInput, Modal, Image, StyleSheet, ToastAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, push, set, onValue } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { useImagePicker } from '../hooks/useImagePicker';
//import * as Location from 'expo-location';
import { useLocation } from '../hooks/useLocation';
import DisplayModal from '../components/DisplayModal';
import Toast from 'react-native-toast-message';

interface Sighting {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
  photoUrl: string;
  timestamp: number;
  userId: string;
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

  // Listen to Firebase for real-time updates of sightings added in this session
  useEffect(() => {
    const sightingsRef = ref(db, 'sightings');
    const unsubscribe = onValue(sightingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Only update sightings that exist in our current local state
        // This ensures we only show markers for sightings added in this session
        setSightings(prevSightings => {
          const updatedSightings = prevSightings.filter(localSighting => {
            // Keep sighting if it still exists in database
            return Object.keys(data).includes(localSighting.id);
          });
          return updatedSightings;
        });
      } else {
        // If no data exists, clear all sightings
        setSightings([]);
      }
    });
    return () => unsubscribe();
  }, []);

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
      //ToastAndroid.show('Please fill in all fields and add a photo', ToastAndroid.SHORT);
      Toast.show({
          type: "info",
          text1: 'Please fill in all fields',
          position: "bottom",
          visibilityTime: 2000
        })
      return;
    }
    try {
      // Get the current user
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        //ToastAndroid.show('You must be logged in to add a sighting', ToastAndroid.SHORT);
        Toast.show({
          type: "info",
          text1: 'You must be logged in to add a sighting',
          position: "bottom",
          visibilityTime: 2000
        })
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
      
      // Add the new sighting to local state for immediate display
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
          userId: user.uid,
        },
      ]);
      
      console.log('Sighting added to database');
      // Reset form and state
      setModalVisible(false);
      setName('');
      setDesc('');
      setCoords(null);
      clearPhoto();
      //ToastAndroid.show('Sighting added!', ToastAndroid.SHORT);
      Toast.show({
          type: "info",
          text1: 'Sighting added!',
          position: "bottom",
          visibilityTime: 2000
        })
    } catch (error) {
      console.error('Error adding sighting:', error);
      //ToastAndroid.show('Failed to add sighting', ToastAndroid.SHORT);
      Toast.show({
          type: "info",
          text1: 'Failed to add sighting',
          position: "bottom",
          visibilityTime: 2000
        })
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map for selecting the sighting location */}
      <MapView
        style={{ flex: 1 }}
        onPress={onMapPress}
        showsUserLocation
        showsCompass
        showsMyLocationButton
        zoomEnabled
        initialRegion={location}
        provider = "google"
      > 
        {/* Show marker if coordinates are selected */}
        {coords && (
          <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} />
        )}
        {sightings.map(sighting => (
          console.log("Rendering marker: ", sighting.lat, sighting.lng),
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
              placeholder="Description/Landmark"
              value={desc}
              onChangeText={setDesc}
              style={styles.input}
            />
            {/* Add and Cancel buttons */}
            <View style={styles.buttonContainer}>
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

//did not use tailwind css so the code soes not become too verbose
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
  buttonContainer: {
    gap: 10,
  },
});

export default AddSpotting;