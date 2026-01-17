import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, Button, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const { width } = Dimensions.get('window');
import {useEffect, useState} from 'react';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import EngagementSection from './EngagementSection';
import { db } from '../../FirebaseConfig';
import { ref, onValue } from 'firebase/database';
import { getLikeCount, getCommentCount } from '../services/EngagementService';

//DisplayModal component to Display the sighting details

const DisplayModal = ({sighting, visible, onClose}: any) => {
  const [currUserId, setCurrUserId] = useState<string | null>(null);
  const [currUserName, setCurrUserName] = useState<string>('Anonymous');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [displayModalVisible, setDisplayModalVisible] = useState(visible);
  const [displaySighting, setDisplaySighting] = useState(sighting);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  
  const openEditModal = () => {
    setEditModalVisible(true);
  }

  const getUpdatedSighting = async () => {
    const sightingRef = ref(db, `sightings/${displaySighting.id}`);
    await onValue(sightingRef, (data) => {
      const value = data.val();
      // Check if the sighting still exists in the database
      if (value) {
        setDisplaySighting({
          id: displaySighting.id,
          name: value.name,
          desc: value.desc,
          lat: value.lat,
          lng: value.lng,
          photoUrl: value.photoUrl,
          timestamp: value.timestamp,
          userId: value.userId,
        });
      } else {
        // If sighting was deleted, close the modal
        //console.log("Sighting was deleted, closing modal");
        setDisplayModalVisible(false);
        onClose();
      }
    });
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
    // only if the User deletes the sighting, the display modal should disappear immediately
    if (button == 'delete') {
      // Close the display modal immediately
      setDisplayModalVisible(false);
      onClose();
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
        setCurrUserName(user.displayName || user.email?.split('@')[0] || 'Anonymous');
      }
    });
    return stopListening;
    }, []);

  // Load engagement metrics
  useEffect(() => {
    const loadEngagementMetrics = async () => {
      try {
        const likes = await getLikeCount(displaySighting.id);
        const comments = await getCommentCount(displaySighting.id);
        setLikeCount(likes);
        setCommentCount(comments);
      } catch (error) {
        console.error('Error loading engagement metrics:', error);
      }
    };

    loadEngagementMetrics();
  }, [displaySighting.id]);

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
                <ScrollView style={styles.scrollContent}>
                  {sighting && (
                    <>
                      <Image
                        source={{ uri: displaySighting.photoUrl }}
                        style={styles.modalImage}
                      />
                      <Text style={styles.modalTitle}>{displaySighting.name}</Text>
                      <Text style={styles.modalDesc}>{displaySighting.desc}</Text>
                      <Text style={styles.timestamp}>
                              Date:     {new Date(displaySighting.timestamp).toLocaleDateString()}
                      </Text>
                      <Text style={styles.timestamp}>
                              Time:     {new Date(displaySighting.timestamp).toLocaleTimeString()}
                      </Text>
                      <Text style={styles.modalLocation}>
                              Location:    {displaySighting.lat?.toFixed(4)}, {displaySighting.lng?.toFixed(4)}
                      </Text>
                    </>
                  )}
                </ScrollView>
                {currUserId && (
                  <EngagementSection
                    sightingId={displaySighting.id}
                    userId={currUserId}
                    userName={currUserName}
                    likeCount={likeCount}
                    commentCount={commentCount}
                    onLikeToggle={(isLiked) => {
                      setLikeCount(isLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
                    }}
                    onCommentAdded={() => {
                      setCommentCount(commentCount + 1);
                    }}
                  />
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
                <ScrollView style={styles.scrollContent}>
                  {sighting && (
                    <>
                      <Image
                        source={{ uri: displaySighting.photoUrl }}
                        style={styles.modalImage}
                      />
                      <Text style={styles.modalTitle}>{displaySighting.name}</Text>
                      <Text style={styles.modalDesc}>{displaySighting.desc}</Text>
                      <Text style={styles.timestamp}>
                              Date:     {new Date(displaySighting.timestamp).toLocaleDateString()}
                      </Text>
                      <Text style={styles.timestamp}>
                              Time:     {new Date(displaySighting.timestamp).toLocaleTimeString()}
                      </Text>
                      <Text style={styles.modalLocation}>
                              Location:     {displaySighting.lat?.toFixed(4)}, {displaySighting.lng?.toFixed(4)}
                      </Text>
                    </>
                  )}
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <Button title = "edit" onPress = {openEditModal}/>
                  <Button title = "delete" onPress ={openDeleteModal}/>
                </View>
                {currUserId && (
                  <EngagementSection
                    sightingId={displaySighting.id}
                    userId={currUserId}
                    userName={currUserName}
                    likeCount={likeCount}
                    commentCount={commentCount}
                    onLikeToggle={(isLiked) => {
                      setLikeCount(isLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
                    }}
                    onCommentAdded={() => {
                      setCommentCount(commentCount + 1);
                    }}
                  />
                )}
                <EditModal visible ={editModalVisible} onClose={closeEditModal} sighting = {displaySighting}/>
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
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    flexDirection: 'column',
  },
  scrollContent: {
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 2,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: -3,
    textAlign: 'center',
    color: 'black',
  },
  modalDesc: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalLocation: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 70,
    gap: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default DisplayModal;