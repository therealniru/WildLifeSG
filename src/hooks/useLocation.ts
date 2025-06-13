import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';

export const useLocation = () => {
  // Marina Bay, Singapore as default
  const [location, setLocation] = useState<Region>({
    latitude: 1.2834,
    longitude: 103.8607,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [hasPermission, setHasPermission] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      // Could not get location, keep default
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      if (granted) {
        getCurrentLocation();
      }
    } catch (err) {
      setHasPermission(false);
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { location, hasPermission, requestPermission, getCurrentLocation };
};

