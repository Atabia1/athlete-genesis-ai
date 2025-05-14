/**
 * Firebase Firestore
 * 
 * This file initializes and exports the Firebase Firestore instance.
 * It provides utility functions for common Firestore operations.
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { app } from "./config";

// Initialize Firestore
const db = getFirestore(app);

/**
 * Create or update a document
 * 
 * @param collectionName Collection name
 * @param id Document ID
 * @param data Document data
 * @param merge Whether to merge with existing data (default: true)
 */
export const setDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData,
  merge = true
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge });
    return id;
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create a new document with auto-generated ID
 * 
 * @param collectionName Collection name
 * @param data Document data
 * @returns Document ID
 */
export const createDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a document by ID
 * 
 * @param collectionName Collection name
 * @param id Document ID
 * @returns Document data or null if not found
 */
export const getDocument = async (
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 * 
 * @param collectionName Collection name
 * @param id Document ID
 * @param data Data to update
 */
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 * 
 * @param collectionName Collection name
 * @param id Document ID
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents
 * 
 * @param collectionName Collection name
 * @param constraints Query constraints (where, orderBy, limit, etc.)
 * @returns Array of documents
 */
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Subscribe to document changes
 * 
 * @param collectionName Collection name
 * @param id Document ID
 * @param callback Function to call when document changes
 * @returns Unsubscribe function
 */
export const subscribeToDocument = (
  collectionName: string,
  id: string,
  callback: (data: DocumentData | null) => void
) => {
  const docRef = doc(db, collectionName, id);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

/**
 * Subscribe to query results
 * 
 * @param collectionName Collection name
 * @param constraints Query constraints
 * @param callback Function to call when query results change
 * @returns Unsubscribe function
 */
export const subscribeToQuery = (
  collectionName: string,
  constraints: QueryConstraint[] = [],
  callback: (data: DocumentData[]) => void
) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(documents);
  });
};

// Export Firestore instance and utility functions
export { 
  db, 
  collection, 
  doc, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  serverTimestamp 
};
