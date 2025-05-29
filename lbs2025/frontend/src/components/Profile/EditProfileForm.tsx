"use client";

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, db, storage } from '../../firebaseConfig'; // Assuming storage is exported from firebaseConfig
import { useRouter } from 'next/navigation';

const EditProfileForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.username || '');
            setCurrentProfilePictureUrl(data.profilePictureUrl || null);
          }
        } catch (err: any) {
          console.error('Error fetching profile:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('User not authenticated. Please log in again.');
      setLoading(false);
      return;
    }

    console.log('Starting profile update process...');
    console.log('Current user UID:', user.uid);
    console.log('Username to save:', username);
    console.log('Profile picture selected:', profilePicture ? profilePicture.name : 'None');

    try {
      let newProfilePictureUrl = currentProfilePictureUrl;

      if (profilePicture) {
        if (!storage) {
          setError('Firebase Storage not initialized. Please check Firebase configuration.');
          setLoading(false);
          return;
        }
        try {
          console.log('Attempting to upload profile picture...');
          const storageRef = ref(storage, `profilePictures/${user.uid}/${profilePicture.name}`);
          console.log('Storage reference:', storageRef.fullPath);
          const uploadResult = await uploadBytes(storageRef, profilePicture);
          console.log('Upload successful:', uploadResult);
          newProfilePictureUrl = await getDownloadURL(storageRef);
          console.log('New profile picture URL:', newProfilePictureUrl);
          setSuccess('Profile picture uploaded successfully!');
        } catch (uploadError: any) {
          console.error('Error uploading profile picture:', uploadError);
          setError(`Failed to upload picture: ${uploadError.message}`);
          setLoading(false);
          return; // Stop if upload fails
        }
      }

      console.log('Attempting to save profile data to Firestore...');
      const userDocRef = doc(db, 'users', user.uid);
      console.log('Firestore document reference:', userDocRef.path);
      await setDoc(userDocRef, {
        username: username,
        profilePictureUrl: newProfilePictureUrl,
      }, { merge: true });
      console.log('Profile data saved to Firestore.');

      setSuccess('Profile updated successfully!');
      router.push('/profile'); // Redirect to profile page after update
    } catch (updateError: any) {
      console.error('Error updating profile data:', updateError);
      setError(`Failed to save profile: ${updateError.message}`);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return null; // Should redirect to login, but handle briefly
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-gray-300 text-sm font-bold mb-2">
              Profile Picture:
            </label>
            {currentProfilePictureUrl && (
              <div className="mb-2">
                <img src={currentProfilePictureUrl} alt="Current Profile" className="w-24 h-24 rounded-full mx-auto" />
              </div>
            )}
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              onChange={handleFileChange}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
