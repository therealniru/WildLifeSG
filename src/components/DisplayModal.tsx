import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
const { width } = Dimensions.get('window');
const DisplayModal = ({sighting, visible, onClose}) => {
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
              </View>
            </TouchableOpacity>
          </Modal>
    );
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