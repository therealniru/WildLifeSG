import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';

export const useLocation = () => {
  // Default to Centre of Singapore
  const [location, setLocation] = useState<Region>({
    latitude: 1.3521,
    longitude: 103.8198,
    latitudeDelta: 0.17,
    longitudeDelta: 0.17,
  });
  const [hasPermission, setHasPermission] = useState(false);

  // Function to request permission and update location
  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setHasPermission(false);
      return false;
    }
    setHasPermission(true);
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });
    return true;
  }, []);

  // On mount, request permission and update location
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { location, hasPermission, requestPermission };
};

