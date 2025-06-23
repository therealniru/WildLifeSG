import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ToastAndroid } from 'react-native';

// Custom hook to handle image picking and state

export const useImagePicker = () => {
  // Store URI of the selected or taken photo
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // function to Pick image from the gallery
  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      ToastAndroid.show('Gallery permission is required', ToastAndroid.SHORT);
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true, // Allow user to crop/edit
      aspect: [4, 3], // Set aspect ratio
      quality: 0.5, // Reduce quality for better performance
      base64: true, // Include base64 data in the response
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhotoUri(uri);
      return uri; // Return the image URI
    }
    return null;
  }, []);

  // function to Take a photo with the camera
  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      ToastAndroid.show('Camera permission is required', ToastAndroid.SHORT);
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true, // Allow user to crop/edit
      aspect: [4, 3], // Set aspect ratio
      quality: 0.5, // Reduce quality for better performance
      base64: true, // Include base64 data in the response
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhotoUri(uri);
      return uri; // Return the photo URI
    }
    return null;
  }, []);

  // function to clear the selected or taken photo
  const clearPhoto = useCallback(() => setPhotoUri(null), []);

  return { photoUri, pickImage, takePhoto, clearPhoto };
};