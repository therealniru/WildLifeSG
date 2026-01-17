import { db } from '../../FirebaseConfig';
import { ref, set, remove, get, update } from 'firebase/database';
import { Comment, Like } from '../types/index';

/**
 * Service for managing likes and comments on sightings
 */

// LIKE OPERATIONS

export const addLike = async (sightingId: string, userId: string): Promise<boolean> => {
  try {
    const likeRef = ref(db, `sightings/${sightingId}/likes/${userId}`);
    const like: Like = {
      userId,
      timestamp: Date.now(),
    };
    await set(likeRef, like);
    return true;
  } catch (error) {
    console.error('Error adding like:', error);
    return false;
  }
};

export const removeLike = async (sightingId: string, userId: string): Promise<boolean> => {
  try {
    const likeRef = ref(db, `sightings/${sightingId}/likes/${userId}`);
    await remove(likeRef);
    return true;
  } catch (error) {
    console.error('Error removing like:', error);
    return false;
  }
};

export const hasUserLiked = async (sightingId: string, userId: string): Promise<boolean> => {
  try {
    const likeRef = ref(db, `sightings/${sightingId}/likes/${userId}`);
    const snapshot = await get(likeRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking like:', error);
    return false;
  }
};

export const getLikeCount = async (sightingId: string): Promise<number> => {
  try {
    const likesRef = ref(db, `sightings/${sightingId}/likes`);
    const snapshot = await get(likesRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

// COMMENT OPERATIONS

export const addComment = async (
  sightingId: string,
  userId: string,
  userName: string,
  text: string
): Promise<string | null> => {
  try {
    const commentId = Date.now().toString();
    const commentRef = ref(db, `sightings/${sightingId}/comments/${commentId}`);
    const comment: Comment = {
      id: commentId,
      userId,
      userName,
      text,
      timestamp: Date.now(),
    };
    await set(commentRef, comment);
    return commentId;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const deleteComment = async (sightingId: string, commentId: string): Promise<boolean> => {
  try {
    const commentRef = ref(db, `sightings/${sightingId}/comments/${commentId}`);
    await remove(commentRef);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

export const getCommentCount = async (sightingId: string): Promise<number> => {
  try {
    const commentsRef = ref(db, `sightings/${sightingId}/comments`);
    const snapshot = await get(commentsRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
};

export const getComments = async (sightingId: string): Promise<Comment[]> => {
  try {
    const commentsRef = ref(db, `sightings/${sightingId}/comments`);
    const snapshot = await get(commentsRef);
    if (snapshot.exists()) {
      const commentsObj = snapshot.val();
      return Object.values(commentsObj) as Comment[];
    }
    return [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};
