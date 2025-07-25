import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
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
  const [filteredSightings, setFilteredSightings] = useState<Sighting[]>([]);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states

  const [speciesFilter, setSpeciesFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState<{lat: number, lng: number} | null>(null);
  const [isLocationFilterActive, setIsLocationFilterActive] = useState(false);

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
      setFilteredSightings(loadedSightings)
      //console.log("Sightings loaded:", loadedSightings);
    });
    return () => unsubscribe();
  }, []);

  // Function to calculate distance between two coordinates
  // HAVERSINE FORMULA
  // (used to calculate the great-circle distance 
  //  between two points on a sphere, given their 
  //  latitudes and longitudes.) (takes into account curvature of the Earth)

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  };

  // Function to apply filters

  const applyFilters = () => {
    let filtered = [...sightings];

    // Species filter (case-insensitive)
    if (speciesFilter.trim()) {
      filtered = filtered.filter(sighting =>
        sighting.name.toLowerCase().includes(speciesFilter.toLowerCase())
      );
    }

    // Date filter (format: YYYY-MM-DD)
    if (dateFilter.trim()) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(sighting => {
        const sightingDate = new Date(sighting.timestamp);
        return sightingDate.toDateString() == filterDate.toDateString();
      });
    }

    // Location filter (5km Radius)
    if (locationFilter && isLocationFilterActive) {
      filtered = filtered.filter(sighting => {
        const distance = calculateDistance(
          locationFilter.lat, locationFilter.lng,
          sighting.lat, sighting.lng
        );
        return distance <= 5;
      });
    }

    setFilteredSightings(filtered);
  };

  // Apply filters whenever filter values change
  // done by setting filters as useEffect dependencies
  useEffect(() => {
    applyFilters();
  }, [speciesFilter, dateFilter, locationFilter, isLocationFilterActive, sightings]);

  // Handle map press for location filter
  const handleMapPress = (event: any) => {
    if (isLocationFilterActive) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setLocationFilter({ lat: latitude, lng: longitude });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSpeciesFilter('');
    setDateFilter('');
    setLocationFilter(null);
    setIsLocationFilterActive(false);
  };


  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      { /* Filter Toggle Button */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>  
      </TouchableOpacity>

      {/* Filter Panel */}
      { showFilters && (
        <View style={styles.filterPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Species Filter */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Species:</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter Species Name"
                value={speciesFilter}
                onChangeText={setSpeciesFilter}
              />
            </View>

            {/* Date Filter */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Date (yyyy-mm-dd):</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="2025-01-01"
                value={dateFilter}
                onChangeText={setDateFilter}
              />
            </View>

            {/* Location Filter */}
            <View style={styles.filterItem}>
              
              <TouchableOpacity
                style={[
                  styles.locationFilterButton,
                  isLocationFilterActive && styles.locationFilterActive
                ]}
                onPress={() => setIsLocationFilterActive(!isLocationFilterActive)}
              >
                <Text style={styles.locationFilterText}>
                  {isLocationFilterActive ? "Tap map to set location" : "Enable location filter"}
                </Text>
              </TouchableOpacity>
              
              {/* Clear Filters - positioned below location filter */}
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>
        </View>
      )}

      <MapView
        style={{ flex: 1 }}
        initialRegion={location}
        showsUserLocation
        provider="google"
        onPress={handleMapPress}
      >
        {filteredSightings.map(sighting => (
          console.log("Rendering marker for sighting:", sighting.lat, sighting.lng),
          <Marker
            key={sighting.id}
            coordinate={{ latitude: sighting.lat, longitude: sighting.lng }}
            onPress={() => setSelectedSighting(sighting)}
          />
        ))}

        {/* Show circle for location filter */}
        {locationFilter && isLocationFilterActive && (
          <Circle
            center = {{ latitude: locationFilter.lat, longitude: locationFilter.lng }}
            radius = {5000} // 5km radius
            strokeColor = "rgba(0, 122, 255, 0.5)"
            fillColor = "rgba(0, 122, 255, 0.1)"
          />
        )}
      </MapView>
      
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

// did not use tailwind css here to kepp the code less verbose earlier
const styles = StyleSheet.create({
  filterToggle: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  filterToggleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterPanel: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1,
  },
  filterItem: {
    marginRight: 15,
    minWidth: 120,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: 'white',
  },
  locationFilterButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationFilterActive: {
    backgroundColor: '#007AFF',
  },
  locationFilterText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
