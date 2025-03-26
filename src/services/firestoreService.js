import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'scores';

/**
 * Save a score to Firestore
 * @param {number} score - The player's score
 * @param {string} playerName - Optional player name
 * @returns {Promise} - The document reference
 */
export const saveScore = async (scoreData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...scoreData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

/**
 * Save high score
 * @param {number} score - The player's score
 * @param {string} playerName - Optional player name
 * @returns {Promise} - The document reference
 */
export const saveHighScore = async (score, playerName = 'Anonymous') => {
  try {
    await addDoc(collection(db, 'highScores'), {
      score,
      playerName,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

/**
 * Get high scores from Firestore
 * @param {number} limit - Number of high scores to retrieve (default: 10)
 * @returns {Promise<Array>} - Array of high score objects
 */
export const getHighScores = async (limitCount = 10) => {
  try {
    const scoresQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(scoresQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting scores:', error);
    throw error;
  }
};

// Get high scores
export const getHighScoresFromHighScoreCollection = async () => {
  try {
    const q = query(
      collection(db, 'highScores'),
      orderBy('score', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
};

// READ - Get single score by ID
export const getScoreById = async (scoreId) => {
  try {
    const scoreDoc = await getDoc(doc(db, COLLECTION_NAME, scoreId));
    if (scoreDoc.exists()) {
      return { id: scoreDoc.id, ...scoreDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting score:', error);
    throw error;
  }
};

// UPDATE - Update a score
export const updateScore = async (scoreId, updateData) => {
  try {
    const scoreRef = doc(db, COLLECTION_NAME, scoreId);
    await updateDoc(scoreRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};

// DELETE - Delete a score
export const deleteScore = async (scoreId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, scoreId));
    return true;
  } catch (error) {
    console.error('Error deleting score:', error);
    throw error;
  }
}; 