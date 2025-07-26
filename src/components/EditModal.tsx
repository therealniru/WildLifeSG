import { useState } from 'react';
import { View, Button, TextInput, Modal, Image, StyleSheet, ToastAndroid } from 'react-native';
import { ref, push, set, update } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { useImagePicker } from '../hooks/useImagePicker';
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

const EditModal = ({ visible, onClose, sighting }: any) => {
    
    const [name, setName] = useState(sighting.name);
    const [desc, setDesc] = useState(sighting.desc);
    // Use the custom image picker hook
    const { photoUri, pickImage, takePhoto, clearPhoto } = useImagePicker();
    const editSighting = async () => {
    // set the coordinates using sighting input
    //setCoords({ lat: sighting.lat, lng: sighting.lng });
    // Validate all fields
        if (!photoUri || !name || !desc) {
        //ToastAndroid.show('Please fill in all fields and add a photo', ToastAndroid.SHORT);
        Toast.show({
          type: "info",
          text1: 'Please fill in all fields',
          position: "bottom",
          visibilityTime: 2000
        })
        return;
        }
        // Push the new sighting to the database
        console.log("here is the sighting id:", sighting.id);
        const editedSightingRef = ref(db, `sightings/${sighting.id}`);
        await update(editedSightingRef, {
            userId: sighting.userId,
            name,
            desc,
            lat: sighting.lat,
            lng: sighting.lng,
            photoUrl: photoUri, // Store the base64 image string
            timestamp: Date.now(),
        });
        //console.log("here is the edited sighting:", editedSightingRef);
        //console.log('Sighting added:', sightings);
        // Reset form and state
        onClose("edit");
        clearPhoto();
        // notifying the user
        //ToastAndroid.show('Edited Sighting!', ToastAndroid.SHORT);
        Toast.show({
          type: "info",
          text1: 'Edited Sighting!',
          position: "bottom",
          visibilityTime: 2000
        })
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => {
                onClose("go back");
                clearPhoto();
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
                    <Button title="Edit Sighting" onPress={editSighting}/>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        onClose('cancel');
                        clearPhoto();
                      }}
                    />
                  </View>
                </View>
              </Modal>
    )
}

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
    gap: 10,
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

export default EditModal;