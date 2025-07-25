import { useState } from 'react';
import { Text, View, Button, TextInput, Modal, Image, StyleSheet, ToastAndroid } from 'react-native';
import { ref, remove } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import Toast from 'react-native-toast-message';


const DeleteModal = ({ visible, onClose, sighting }: any) => { 
    const deleteSighting = async () => {
        // create a refernce to the sighting in the database
        const deletedSightingRef = ref(db, `sightings/${sighting.id}`);
        // delete the sighting
        await remove(deletedSightingRef);
        // Alert the user
        //ToastAndroid.show('Deleted Sighting!', ToastAndroid.SHORT);
        Toast.show({
          type: "info",
          text1: 'Deleted Sighting!',
          position: "bottom",
          visibilityTime: 2000
        })
        // close the Modal
        onClose('delete');
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => onClose('go back')}
        >
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style = {styles.question}>Are you sure you want to delete sighting ?</Text>
                    {/* Yes and No buttons */}
                    <Button title = "Yes" onPress = {deleteSighting} />
                    <Button
                      title = "No"
                      onPress={() => onClose('no')}
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
  question: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default DeleteModal;