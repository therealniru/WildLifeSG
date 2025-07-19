import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, Button } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const { width } = Dimensions.get('window');
import {useEffect, useState} from 'react';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { db } from '../../FirebaseConfig';
import { ref, onValue } from 'firebase/database';

//DisplayModal component to Display the sighting details

const DisplayModal = ({sighting, visible, onClose}: any) => {
  const [currUserId, setCurrUserId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [displayModalVisible, setDisplayModalVisible] = useState(visible);
  const [displaySighting, setDisplaySighting] = useState(sighting);
  
  const openEditModal = () => {
    setEditModalVisible(true);
  }

  const getUpdatedSighting = async () => {
    const sightingRef = ref(db, `sightings/${displaySighting.id}`);
    await onValue(sightingRef, (data) => {
      const value = data.val();
      setDisplaySighting({
        id: displaySighting.id,
        name: value.name,
        desc: value.desc,
        lat: value.lat,
        lng: value.lng,
        photoUrl: value.photoUrl,
        timestamp: value.timestamp,
        userId: value.userId,
      })
    })
    
  }

  const closeEditModal = (button: string) => {
    setEditModalVisible(false);
    // If the User edits the sighting, the display modal will display the newe sighting's modal
    if (button == 'edit') {
      getUpdatedSighting();
    }
  }

  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  }

  const closeDeleteModal = (button: string) => {
    setDeleteModalVisible(false);
    // only if the User deletes the sighting, the display modal should disaappear
    if (button == 'delete') {
      closeDisplayModal();
    }
  }

  const closeDisplayModal = () => {
    setDisplayModalVisible(false);
    onClose();
  }

  // getting the current user's ID
  useEffect(() => {
    const auth = getAuth();
    const stopListening = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUserId(user.uid);
      }
    });
    return stopListening;
    }, []);

  console.log("Current user ID:", currUserId, "Sighting user ID:", sighting?.userId);

  // Display option to edit based on whether it is the user's own sighting

  if (currUserId !== displaySighting.userId) {
    return (
        <Modal
            visible={displayModalVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPressOut={onClose}
            >
              <View style={styles.modalContent}>
                {sighting && (
                  <>
                    <Image
                      source={{ uri: displaySighting.photoUrl }}
                      style={styles.modalImage}
                    />
                    <Text style={styles.modalTitle}>{displaySighting.name}</Text>
                    <Text style={styles.modalDesc}>{displaySighting.desc}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
    );} else {
      return (
        <Modal
            visible={displayModalVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPressOut={onClose}
            >
              <View style={styles.modalContent}>
                {sighting && (
                  <>
                    <Image
                      source={{ uri: displaySighting.photoUrl }}
                      style={styles.modalImage}
                    />
                    <Text style={styles.modalTitle}>{displaySighting.name}</Text>
                    <Text style={styles.modalDesc}>{displaySighting.desc}</Text>
                  </>
                )}
                <Button title = "edit" onPress = {openEditModal}/>
                <EditModal visible ={editModalVisible} onClose={closeEditModal} sighting = {displaySighting}/>
                <Button title = "delete" onPress ={openDeleteModal}/>
                <DeleteModal visible = {deleteModalVisible} onClose = {closeDeleteModal} sighting = {displaySighting}/>
              </View>
            </TouchableOpacity>
          </Modal> 
        )
      }
}



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
    gap: 10,
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

export default DisplayModal;