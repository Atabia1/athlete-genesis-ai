/**
 * Firebase Storage
 * 
 * This file initializes and exports the Firebase Storage instance.
 * It provides utility functions for common storage operations.
 */

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadString,
  uploadBytesResumable,
  UploadTaskSnapshot
} from "firebase/storage";
import { app } from "./config";

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * 
 * @param path Storage path (e.g., 'users/user123/profile.jpg')
 * @param file File to upload
 * @returns Download URL
 */
export const uploadFile = async (path: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Upload a file with progress tracking
 * 
 * @param path Storage path
 * @param file File to upload
 * @param onProgress Progress callback
 * @returns Promise that resolves with download URL
 */
export const uploadFileWithProgress = (
  path: string,
  file: File,
  onProgress?: (progress: number, snapshot: UploadTaskSnapshot) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress, snapshot);
          }
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    } catch (error) {
      console.error("Error setting up upload:", error);
      reject(error);
    }
  });
};

/**
 * Upload a data URL string to Firebase Storage
 * 
 * @param path Storage path
 * @param dataUrl Data URL string (e.g., from canvas.toDataURL())
 * @param metadata Optional metadata
 * @returns Download URL
 */
export const uploadDataUrl = async (
  path: string,
  dataUrl: string,
  metadata = { contentType: 'image/jpeg' }
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url', metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading data URL:", error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * 
 * @param path Storage path
 * @returns Download URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param path Storage path
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/**
 * List all files in a directory
 * 
 * @param path Directory path
 * @returns Array of file references
 */
export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    // Get download URLs for all items
    const items = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url
        };
      })
    );
    
    return {
      items,
      prefixes: result.prefixes.map(prefix => ({
        name: prefix.name,
        fullPath: prefix.fullPath
      }))
    };
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

export { storage, ref, getDownloadURL };
