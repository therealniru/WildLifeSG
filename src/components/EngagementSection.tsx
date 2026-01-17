import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { addLike, removeLike, hasUserLiked, addComment, getComments } from '../services/EngagementService';
import { Comment } from '../types/index';

interface EngagementSectionProps {
  sightingId: string;
  userId: string;
  userName: string;
  likeCount: number;
  commentCount: number;
  onLikeToggle?: (isLiked: boolean) => void;
  onCommentAdded?: () => void;
}

const EngagementSection: React.FC<EngagementSectionProps> = ({
  sightingId,
  userId,
  userName,
  likeCount,
  commentCount,
  onLikeToggle,
  onCommentAdded,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [currentCommentCount, setCurrentCommentCount] = useState(commentCount);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkIfUserLiked();
  }, [sightingId, userId]);

  const checkIfUserLiked = async () => {
    const liked = await hasUserLiked(sightingId, userId);
    setIsLiked(liked);
  };

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const success = await removeLike(sightingId, userId);
        if (success) {
          setIsLiked(false);
          setCurrentLikeCount(Math.max(0, currentLikeCount - 1));
          onLikeToggle?.(false);
        }
      } else {
        const success = await addLike(sightingId, userId);
        if (success) {
          setIsLiked(true);
          setCurrentLikeCount(currentLikeCount + 1);
          onLikeToggle?.(true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const success = await addComment(sightingId, userId, userName, commentText);
      if (success) {
        setCommentText('');
        setCurrentCommentCount(currentCommentCount + 1);
        onCommentAdded?.();
        // Refresh comments list
        if (showComments) {
          loadComments();
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const loadedComments = await getComments(sightingId);
      // Sort by timestamp descending (newest first)
      const sorted = loadedComments.sort((a, b) => b.timestamp - a.timestamp);
      setComments(sorted);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
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

  return (
    <View style={styles.container}>
      {/* Like and Comment Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem} onPress={handleLikeToggle}>
          <Text style={[styles.statIcon, isLiked && styles.likedIcon]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.statText}>{currentLikeCount} {currentLikeCount === 1 ? 'Like' : 'Likes'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={toggleComments}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statText}>{currentCommentCount} {currentCommentCount === 1 ? 'Comment' : 'Comments'}</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Input Section */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          placeholderTextColor="#999"
          editable={!isSubmitting}
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleAddComment}
          disabled={isSubmitting || !commentText.trim()}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? '...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      {showComments && (
        <View style={styles.commentsContainer}>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : comments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
          ) : (
            <ScrollView style={styles.commentsList} nestedScrollEnabled>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.userName}</Text>
                    <Text style={styles.commentTime}>{formatDate(comment.timestamp)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  likedIcon: {
    fontSize: 20,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  commentInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  commentsContainer: {
    maxHeight: 300,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: '600',
    fontSize: 13,
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    paddingVertical: 16,
  },
});

export default EngagementSection;
