"use client";

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { app, db } from '../../firebaseConfig'; // Assuming db is exported from firebaseConfig
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            setProfile(docSnap.data());
          } else {
            console.log('No such document for user profile, creating one!');
            // Create a basic user document if it doesn't exist
            await setDoc(docRef, {
              email: currentUser.email,
              createdAt: new Date(),
              // Add any other default profile fields here
            });
            setProfile({ email: currentUser.email, createdAt: new Date() }); // Set initial profile data
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">User Profile</h2>
        <div className="mb-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {profile?.username || 'Not set'}</p>
          {profile?.profilePictureUrl && (
            <div className="mb-4">
              <img src={profile.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
            </div>
          )}
        </div>
        <button
          onClick={() => router.push('/edit-profile')} // Assuming an edit-profile page
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
