import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, onValue } from 'firebase/database';
import { db } from '../../FirebaseConfig';
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
  userId: string;
}

const { width } = Dimensions.get('window');

const ViewSightings = () => {
  console.log("ViewSightings component rendered");
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);

  // Use the custom location hook
  const { location, hasPermission } = useLocation();

  useEffect(() => {
    const sightingsRef = ref(db, 'sightings');
    const unsubscribe = onValue(sightingsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSightings: Sighting[] = [];
      if (data) {
        Object.entries(data).forEach(([id, value]: [string, any]) => {
          console.log("Loading sighting:", id, value.lat, value.lng);
          loadedSightings.push({
            id,
            name: value.name,
            desc: value.desc,
            lat: value.lat,
            lng: value.lng,
            photoUrl: value.photoUrl,
            timestamp: value.timestamp,
            userId: value.userId,
          });
        });
      }
      setSightings(loadedSightings);
      //console.log("Sightings loaded:", loadedSightings);
    });
    return () => unsubscribe();
  }, []);

  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={location}
        showsUserLocation
        provider="google"
      >
        {sightings.map(sighting => (
          console.log("Rendering marker for sighting:", sighting.lat, sighting.lng),
          <Marker
            key={sighting.id}
            coordinate={{ latitude: sighting.lat, longitude: sighting.lng }}
            onPress={() => setSelectedSighting(sighting)}
          />
        ))}
      </MapView>
      {/* Old Version of Modal for displaying selected sighting details */}
      {/* <Modal
        visible={!!selectedSighting}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSighting(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => setSelectedSighting(null)}
        >
          <View style={styles.modalContent}>
            {selectedSighting && (
              <>
                <Image
                  source={{ uri: selectedSighting.photoUrl }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedSighting.name}</Text>
                <Text style={styles.modalDesc}>{selectedSighting.desc}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal> */}
      {/* importing DisplayModal Component*/}
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
});

export default ViewSightings;
