import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

export const useUploadImages = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);

  const uploadImage = (file, path = 'products') => {
    return new Promise((resolve, reject)=> {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${path}/${fileName}`;
      const storageRef = ref(storage, filePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      setError(null);
      setProgress(prev => ({...prev, [file.name]: 0 }));

      uploadTask.on('state_changed',
        (snapshot)=> {
          const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prev => ({...prev, [file.name]: progressValue }));
        },
        (error)=> {
          setError(error.message);
          setUploading(false);
          reject(error)
        },

        async ()=> {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress(prev => ({...prev, [file.name]: 100 }));
            setUploading(false);
            resolve({
              url,
              path : filePath,
              name : fileName
            });
          } catch (err) {
            setError(err.message);
            setUploading(false);
            reject(err);
          }
        }
      );
    });
  };

  const uploadMultiImages = async (files, path = "products") => {
    try {
      setError(null);
      const promises = Array.from(files).map(file => uploadImage(file, path));
      return await Promise.all(promises);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearErrors = ()=> setError(null);

  return {
    uploadImage,
    uploadMultiImages,
    uploading,
    progress,
    error,
    clearErrors
  };
};