import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, ActivityIndicator, Button } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const { width } = Dimensions.get('window');
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import {useEffect, useState} from 'react';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { set } from 'firebase/database';

//const user = FIREBASE_AUTH.currentUser;

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



const DisplayModal = ({sighting, visible, onClose}: any) => {
  const [currUserId, setCurrUserId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [displayModalVisible, setDisplayModalVisible] = useState(visible);
  
  const openEditModal = () => {
    setEditModalVisible(true);
    setDisplayModalVisible(false);
  }

  const closeEditModal = () => {
    setEditModalVisible(false);
  }

   const openDeleteModal = () => {
    setDeleteModalVisible(true);
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
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

  // Display Option to edit based on whether it is the user's own sighting

  if (currUserId !== sighting.userId) {
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
                      source={{ uri: sighting.photoUrl }}
                      style={styles.modalImage}
                    />
                    <Text style={styles.modalTitle}>{sighting.name}</Text>
                    <Text style={styles.modalDesc}>{sighting.desc}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
    );} else {
      return (
        <Modal
            visible={visible}
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
                      source={{ uri: sighting.photoUrl }}
                      style={styles.modalImage}
                    />
                    <Text style={styles.modalTitle}>{sighting.name}</Text>
                    <Text style={styles.modalDesc}>{sighting.desc}</Text>
                  </>
                )}
                <Button title = "edit" onPress ={openEditModal}/>
                <EditModal visible ={editModalVisible} onClose={() => {closeEditModal(); closeDisplayModal()}} sighting={sighting}/>
                <Button title = "delete" onPress ={openDeleteModal}/>
                <DeleteModal visible = {deleteModalVisible} onClose = {() => {closeDeleteModal(); closeDisplayModal()}} sighting = {sighting}/>
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