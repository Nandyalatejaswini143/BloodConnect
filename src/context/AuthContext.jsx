
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../firebase';

const AuthContext = createContext(null);

// Normalize city names for consistent searching.
const normalizeCity = (city) => {
  return String(city || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize donor information with the public directory.
  
// Synchronize only non-sensitive donor information
// with the public directory.
const syncPublicDonorDirectory = async (uid, profile) => {
  if (!profile) return;

  const directoryData = {
    bloodGroup: profile.bloodGroup || '',
    city: profile.city || '',
    cityKey: profile.cityKey || normalizeCity(profile.city),
    availability: Boolean(profile.availability),
    updatedAt: serverTimestamp()
  };

  // Overwrite the complete public directory document.
  // This also removes previously stored latitude
  // and longitude fields.
  await setDoc(
    doc(db, 'publicDonorDirectory', uid),
    directoryData
  );
};

  // Recover the specific existing donor account.
  const recoverExistingDonorAccount = async (user) => {
    const uid = user.uid;

    const donorData = {
      fullName: 'Munna',
      email: user.email,
      bloodGroup: 'A+',
      city: 'Vizianagaram',
      cityKey: normalizeCity('Vizianagaram'),
      createdAt: serverTimestamp(),
      availability: false
    };

    // Restore the private donor profile.
    await setDoc(
      doc(db, 'donors', uid),
      donorData,
      { merge: true }
    );

    // Restore the account role document.
    await setDoc(
      doc(db, 'users', uid),
      {
        role: 'donor',
        fullName: 'Munna',
        email: user.email,
        createdAt: serverTimestamp()
      },
      { merge: true }
    );

    // Restore the public donor directory.
    await syncPublicDonorDirectory(uid, donorData);

    return donorData;
  };

  // Load role and profile after authentication.
  const loadUserRole = async (user) => {
    if (!user) {
      setUserRole(null);
      setDonorProfile(null);
      setPatientProfile(null);
      return null;
    }

    const userRef = doc(db, 'users', user.uid);
    const donorRef = doc(db, 'donors', user.uid);

    let userSnap = await getDoc(userRef);
    let donorSnap = null;

    console.log('AUTH UID:', user.uid);
    console.log('FIREBASE PROJECT:', auth.app.options.projectId);
    console.log('USER DOCUMENT EXISTS:', userSnap.exists());

    let role = null;

    if (userSnap.exists()) {
      role = userSnap.data().role;
    }

    // Check whether an older donor profile exists.
    if (!role) {
      donorSnap = await getDoc(donorRef);

      if (donorSnap.exists()) {
        const donorData = donorSnap.data();

        role = 'donor';

        await setDoc(userRef, {
          role: 'donor',
          fullName:
            donorData.fullName ||
            user.displayName ||
            'Voluntary Donor',
          email: donorData.email || user.email || '',
          createdAt: serverTimestamp()
        });

        userSnap = await getDoc(userRef);
      }
    }

    // Recover only the specified account when both
    // Firestore documents are missing.
    if (
      !userSnap.exists() &&
      (!donorSnap || !donorSnap.exists()) &&
      user.email?.toLowerCase() === 'maddymunna46@gmail.com'
    ) {
      console.log('Recovering existing donor account...');

      await recoverExistingDonorAccount(user);

      role = 'donor';
    }

    if (role === 'donor') {
      donorSnap = await getDoc(donorRef);

      if (!donorSnap.exists()) {
        throw new Error('Donor profile not found.');
      }

      const donorData = donorSnap.data();

      const profile = {
        ...donorData,
        cityKey:
          donorData.cityKey ||
          normalizeCity(donorData.city)
      };

      setUserRole('donor');
      setDonorProfile(profile);
      setPatientProfile(null);

      await syncPublicDonorDirectory(user.uid, profile);

      return 'donor';
    }

    if (role === 'patient') {
      const patientRef = doc(db, 'patients', user.uid);
      const patientSnap = await getDoc(patientRef);

      if (!patientSnap.exists()) {
        throw new Error('Patient profile not found.');
      }

      setUserRole('patient');
      setPatientProfile(patientSnap.data());
      setDonorProfile(null);

      return 'patient';
    }

    throw new Error(
      'Your account role could not be identified. Please contact support.'
    );
  };

  // Firebase authentication state listener.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setLoading(true);
        setCurrentUser(user);

        try {
          if (user) {
            await loadUserRole(user);
          } else {
            setUserRole(null);
            setDonorProfile(null);
            setPatientProfile(null);
          }
        } catch (error) {
          console.error(
            'Authentication state error:',
            error
          );

          setUserRole(null);
          setDonorProfile(null);
          setPatientProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Register a new donor.
  const registerDonor = async ({
    fullName,
    email,
    password,
    bloodGroup,
    city,
    location
  }) => {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName.trim()
    });

    const donorData = {
      fullName: fullName.trim(),
      email: email.trim(),
      bloodGroup,
      city: city.trim(),
      cityKey: normalizeCity(city),
      createdAt: serverTimestamp(),
      availability: false
    };

    if (
      location &&
      Number.isFinite(Number(location.latitude)) &&
      Number.isFinite(Number(location.longitude))
    ) {
      donorData.location = {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        updatedAt: serverTimestamp()
      };
    }

    await setDoc(
      doc(db, 'donors', user.uid),
      donorData
    );

    await setDoc(
      doc(db, 'users', user.uid),
      {
        role: 'donor',
        fullName: fullName.trim(),
        email: email.trim(),
        createdAt: serverTimestamp()
      }
    );

    const profile = {
      ...donorData,
      cityKey: normalizeCity(city),
      availability: false
    };

    await syncPublicDonorDirectory(user.uid, profile);

    setCurrentUser(user);
    setUserRole('donor');
    setDonorProfile(profile);
    setPatientProfile(null);

    return user;
  };

  // Register a new patient.
  const registerPatient = async ({
    fullName,
    email,
    password,
    city
  }) => {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName.trim()
    });

    const patientData = {
      fullName: fullName.trim(),
      email: email.trim(),
      city: city.trim(),
      createdAt: serverTimestamp()
    };

    await setDoc(
      doc(db, 'users', user.uid),
      {
        role: 'patient',
        fullName: fullName.trim(),
        email: email.trim(),
        createdAt: serverTimestamp()
      }
    );

    await setDoc(
      doc(db, 'patients', user.uid),
      patientData
    );

    setCurrentUser(user);
    setUserRole('patient');
    setPatientProfile(patientData);
    setDonorProfile(null);

    return user;
  };

  // Login for both patient and donor accounts.
  const loginUser = async (email, password) => {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    const user = userCredential.user;

    setCurrentUser(user);

    const role = await loadUserRole(user);

    return {
      user,
      role
    };
  };

  // Backward-compatible donor login.
  const loginDonor = async (email, password) => {
    const result = await loginUser(email, password);
    return result.user;
  };

  // Logout.
  const logoutDonor = async () => {
    await signOut(auth);

    setCurrentUser(null);
    setUserRole(null);
    setDonorProfile(null);
    setPatientProfile(null);
  };

  // Update donor availability.
  const updateAvailability = async (newAvailability) => {
    if (!currentUser || userRole !== 'donor') {
      throw new Error(
        'Only logged-in donors can update availability.'
      );
    }

    const availability = Boolean(newAvailability);

    await setDoc(
      doc(db, 'donors', currentUser.uid),
      {
        availability,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    const updatedProfile = {
      ...donorProfile,
      availability
    };

    await syncPublicDonorDirectory(
      currentUser.uid,
      updatedProfile
    );

    setDonorProfile(updatedProfile);

    return updatedProfile;
  };

  // Refresh the currently logged-in user's profile.
  const refreshProfile = async () => {
    if (!currentUser) return null;

    if (userRole === 'donor') {
      const donorSnap = await getDoc(
        doc(db, 'donors', currentUser.uid)
      );

      if (donorSnap.exists()) {
        const donorData = donorSnap.data();

        const profile = {
          ...donorData,
          cityKey:
            donorData.cityKey ||
            normalizeCity(donorData.city)
        };

        setDonorProfile(profile);

        await syncPublicDonorDirectory(
          currentUser.uid,
          profile
        );

        return profile;
      }
    }

    if (userRole === 'patient') {
      const patientSnap = await getDoc(
        doc(db, 'patients', currentUser.uid)
      );

      if (patientSnap.exists()) {
        const profile = patientSnap.data();
        setPatientProfile(profile);
        return profile;
      }
    }

    return null;
  };

  const value = {
    currentUser,
    userRole,
    donorProfile,
    patientProfile,
    loading,
    registerDonor,
    registerPatient,
    loginUser,
    loginDonor,
    logoutDonor,
    updateAvailability,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Named export.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider.'
    );
  }

  return context;
};

export default AuthProvider;
