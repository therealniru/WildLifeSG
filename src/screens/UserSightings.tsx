import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { getLikeCount, getCommentCount, getComments } from '../services/EngagementService';
import { Comment } from '../types/index';

interface Sighting {
    id: string;
    lat: number;
    lng: number;
    name: string;
    desc: string;
    timestamp: number;
    photoUrl?: string;
    userId: string;
    likeCount?: number;
    commentCount?: number;
}

const UserSightings = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentsData, setCommentsData] = useState<{ [key: string]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

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
              likeCount: 0,
              commentCount: 0,
            });
          });
        }

        // Sort by newest first
        const sorted = userSightings.sort((a, b) => b.timestamp - a.timestamp);
        setSightings(sorted);

        // Load engagement metrics for each sighting
        await Promise.all(
          sorted.map(async (sighting) => {
            try {
              const likeCount = await getLikeCount(sighting.id);
              const commentCount = await getCommentCount(sighting.id);
              setSightings((prev) =>
                prev.map((s) =>
                  s.id === sighting.id
                    ? { ...s, likeCount, commentCount }
                    : s
                )
              );
            } catch (error) {
              console.error(`Error loading metrics for ${sighting.id}:`, error);
            }
          })
        );
      } catch (error) {
        //console.error('Error fetching sightings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSightings();
  }, []);

  const toggleComments = async (sightingId: string) => {
    if (expandedComments[sightingId]) {
      // Just collapse
      setExpandedComments((prev) => ({
        ...prev,
        [sightingId]: false,
      }));
    } else {
      // Load comments and expand
      setLoadingComments((prev) => ({
        ...prev,
        [sightingId]: true,
      }));
      try {
        const comments = await getComments(sightingId);
        const sorted = comments.sort((a, b) => b.timestamp - a.timestamp);
        setCommentsData((prev) => ({
          ...prev,
          [sightingId]: sorted,
        }));
        setExpandedComments((prev) => ({
          ...prev,
          [sightingId]: true,
        }));
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments((prev) => ({
          ...prev,
          [sightingId]: false,
        }));
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderComment = (comment: Comment) => (
    <View key={comment.id} style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{comment.userName}</Text>
        <Text style={styles.commentTime}>{formatDate(comment.timestamp)}</Text>
      </View>
      <Text style={styles.commentText}>{comment.text}</Text>
    </View>
  );

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
      
      {/* Engagement Metrics */}
      <View style={styles.engagementContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricIcon}>❤️</Text>
          <Text style={styles.metricText}>{item.likeCount || 0}</Text>
        </View>
        <TouchableOpacity
          style={styles.metricItem}
          onPress={() => toggleComments(item.id)}
        >
          <Text style={styles.metricIcon}>💬</Text>
          <Text style={styles.metricText}>{item.commentCount || 0}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {expandedComments[item.id] && (
        <View style={styles.commentsSection}>
          {loadingComments[item.id] ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (commentsData[item.id] || []).length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          ) : (
            <ScrollView style={styles.commentsList} nestedScrollEnabled>
              {commentsData[item.id]?.map((comment) => renderComment(comment))}
            </ScrollView>
          )}
        </View>
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
  engagementContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    gap: 24,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricIcon: {
    fontSize: 16,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  commentsList: {
    maxHeight: 250,
  },
  commentItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: '600',
    fontSize: 13,
    color: '#2c3e50',
  },
  commentTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  commentText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 13,
    paddingVertical: 8,
  },
});

export default UserSightings;