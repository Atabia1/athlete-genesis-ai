/**
 * Firebase Module Index
 * 
 * This file exports all Firebase modules and utilities for easy importing.
 */

// Export Firebase app and analytics
export { app, analytics } from './config';

// Export Firebase Authentication
export { 
  auth,
  signIn,
  signUp,
  signOut,
  resetPassword,
  getCurrentUser,
  onAuthChange
} from './auth';

// Export Firebase Firestore
export {
  db,
  collection,
  doc,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  setDocument,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  subscribeToDocument,
  subscribeToQuery
} from './firestore';

// Export Firebase Storage
export {
  storage,
  ref,
  getDownloadURL,
  uploadFile,
  uploadFileWithProgress,
  uploadDataUrl,
  getFileUrl,
  deleteFile,
  listFiles
} from './storage';
