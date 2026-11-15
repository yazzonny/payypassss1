import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isLiveFirebaseConfigured } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export const AUTHORIZED_ADMIN_EMAIL = 'yznyzn123@gmail.com';

const LOCAL_USER_KEY = 'playpass_current_user_v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLiveFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const isAuthorizedAdmin = firebaseUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: isAuthorizedAdmin ? 'admin' : 'customer'
          };
          setUser(userData);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
        } else {
          const saved = localStorage.getItem(LOCAL_USER_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.isDemo) {
              setUser(null);
              localStorage.removeItem(LOCAL_USER_KEY);
            }
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim();
    if (isLiveFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const isAuthorizedAdmin = cred.user.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
        const userData = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || cred.user.email.split('@')[0],
          role: isAuthorizedAdmin ? 'admin' : 'customer'
        };
        setUser(userData);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      } catch (err) {
        console.warn('Firebase login failed:', err.message);
        throw err;
      }
    }

    // Local Demo / Offline Fallback login
    // Demo mode has no real authentication, so the admin role is only ever
    // granted in local development builds, never in a deployed site.
    const isAuthorizedAdmin =
      import.meta.env.DEV && cleanEmail.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    const mockUser = {
      uid: `user-${Date.now()}`,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      role: isAuthorizedAdmin ? 'admin' : 'customer',
      isDemo: true
    };
    setUser(mockUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const register = async (email, password, name = '', phone = '') => {
    const cleanEmail = email.trim();
    if (isLiveFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        // Security rule: newly registered users NEVER get admin role
        const userData = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: name || cred.user.email.split('@')[0],
          phone,
          role: 'customer'
        };
        setUser(userData);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
      } catch (err) {
        console.warn('Firebase register failed:', err.message);
        throw err;
      }
    }

    // Local Demo registration
    const mockUser = {
      uid: `user-${Date.now()}`,
      email: cleanEmail,
      displayName: name || cleanEmail.split('@')[0],
      phone,
      role: 'customer',
      isDemo: true
    };
    setUser(mockUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const logout = async () => {
    if (isLiveFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase signOut error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  // Strictly check that user email matches yznyzn123@gmail.com
  // Demo (non-Firebase) sessions can never be admin on a deployed site, so a
  // forged localStorage entry cannot unlock the admin UI. Real data protection
  // must still be enforced by Firestore security rules.
  const isAdmin = Boolean(
    user?.email &&
    user.role === 'admin' &&
    user.email.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase() &&
    (import.meta.env.DEV || (isLiveFirebaseConfigured && !user.isDemo))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
