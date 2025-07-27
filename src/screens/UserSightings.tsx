import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';

interface Sighting {
    id: string;
    lat: number;
    lng: number;
    name: string;
    desc: string;
    timestamp: number;
    photoUrl?: string;
    userId: string;
}

const UserSightings = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSightings = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const sightingsRef = ref(db, 'sightings');
        const userSightingsQuery = query(
          sightingsRef,
          orderByChild('userId'),
          equalTo(user.uid)
        );

        const snapshot = await get(userSightingsQuery);
        const userSightings: Sighting[] = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            userSightings.push({
              id: childSnapshot.key || '',
              lat: data.lat,
              lng: data.lng,
              name: data.name,
              desc: data.desc,
              timestamp: data.timestamp,
              photoUrl: data.photoUrl,
              userId: data.userId,
            });
          });
        }

        // Sort by newest first
        setSightings(userSightings.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        //console.error('Error fetching sightings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSightings();
  }, []);

  const renderSighting = ({ item }: { item: Sighting }) => (
    <View style={styles.sightingCard}>
      <Text style={styles.species}>{item.name}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
      <Text style={styles.timestamp}>
        Date:            {new Date(item.timestamp).toLocaleDateString()}
      </Text>
      <Text style={styles.location}>
        Location:    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
      </Text>
      {item.photoUrl && (
        <Image
          source={{ uri: item.photoUrl }}
          style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 8 }}
          resizeMode="cover"
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading your sightings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sightings.length === 0 ? (
        <Text style={styles.noSightings}>No sightings added yet</Text>
      ) : (
        <FlatList
          data={sightings}
          renderItem={renderSighting}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContainer: {
    padding: 8,
  },
  sightingCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  species: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  desc: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  location: {
    fontSize: 15,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 15,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  noSightings: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 20,
  },
});

export default UserSightings;