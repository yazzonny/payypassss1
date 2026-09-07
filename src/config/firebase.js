import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialProducts';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if valid Firebase configuration is present
export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isLiveFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.info('⚡ PlayPass connected to Live Firebase Firestore & Auth.');
  } catch (error) {
    console.warn('⚠️ Firebase init error, falling back to local demo mode:', error);
  }
} else {
  console.info('🕹️ PlayPass running in Local Demo Mode (Local Storage + Preloaded Products). Add credentials to .env.local to activate Live Firebase.');
}

// Local Storage Keys for offline fallback
const STORAGE_KEYS = {
  PRODUCTS: 'playpass_products_v1',
  ORDERS: 'playpass_orders_v1',
  USERS: 'playpass_users_v1',
  SETTINGS: 'playpass_settings_v1'
};

export const BANK_DETAILS = {
  bankName_en: 'Arab Bank',
  bankName_ar: 'البنك العربي',
  accountName_en: 'Yazan Almustafa',
  accountName_ar: 'يزن المصطفى',
  phone: '+962780114108'
};

export const DEFAULT_SETTINGS = {
  paymentLink: '',
  whatsappNumber: '+962780114108'
};

// Helper to initialize local storage seed data if empty
function ensureLocalSeedData() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}

// Ensure seed data is ready immediately
ensureLocalSeedData();

// --- Settings Service ---
export const settingsService = {
  async get() {
    if (isLiveFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() };
        }
      } catch (err) {
        console.warn('Firestore settings fetch failed, reading from local cache:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  },

  async update(newSettings) {
    const current = await this.get();
    const merged = { ...current, ...newSettings };
    if (isLiveFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
      } catch (err) {
        console.warn('Firestore settings save failed, persisting locally:', err);
      }
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('playpass_settings_updated', { detail: merged }));
    return merged;
  }
};

// --- Product Service ---
export const productService = {
  async getAll() {
    if (isLiveFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Firestore fetch failed, reading from local cache:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find(p => p.id === id) || null;
  },

  async save(product) {
    if (isLiveFirebaseConfigured && db) {
      try {
        const id = product.id || `prod-${Date.now()}`;
        const cleanProduct = { ...product, id };
        await setDoc(doc(db, 'products', id), cleanProduct, { merge: true });
        return cleanProduct;
      } catch (err) {
        console.warn('Firestore save failed, persisting locally:', err);
      }
    }
    const all = await this.getAll();
    let updated;
    const existingIndex = all.findIndex(p => p.id === product.id);
    const newId = product.id || `prod-${Date.now()}`;
    const productWithId = { ...product, id: newId };

    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = productWithId;
    } else {
      updated = [productWithId, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return productWithId;
  },

  async delete(id) {
    if (isLiveFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.warn('Firestore delete failed:', err);
      }
    }
    const all = await this.getAll();
    const filtered = all.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
  }
};

// --- Order Service ---
export const orderService = {
  async getAll() {
    if (isLiveFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Firestore orders fetch failed:', err);
      }
    }
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  },

  async create(orderData) {
    const id = `PP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id,
      ...orderData,
      status: 'Pending Verification',
      paymentProofUrl: orderData.paymentProofUrl || '',
      fulfillmentNotes: '',
      rejectionReason: '',
      createdAt: new Date().toISOString()
    };

    if (isLiveFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', id), newOrder);
        return newOrder;
      } catch (err) {
        console.warn('Firestore order create failed:', err);
      }
    }
    const all = await this.getAll();
    const updated = [newOrder, ...all];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return newOrder;
  },

  async updateStatus(orderId, newStatus, fulfillmentNotes = '', rejectionReason = '') {
    const patch = { status: newStatus };
    if (fulfillmentNotes !== undefined && fulfillmentNotes !== '') {
      patch.fulfillmentNotes = fulfillmentNotes;
    }
    if (rejectionReason !== undefined) {
      patch.rejectionReason = rejectionReason;
    }

    if (isLiveFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), patch);
      } catch (err) {
        console.warn('Firestore order update failed:', err);
      }
    }
    const all = await this.getAll();
    const updated = all.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          fulfillmentNotes: fulfillmentNotes !== '' ? fulfillmentNotes : order.fulfillmentNotes,
          rejectionReason: rejectionReason !== undefined ? rejectionReason : (order.rejectionReason || '')
        };
      }
      return order;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return true;
  }
};

// --- Image Upload Service ---
export const imageService = {
  async upload(file, folder = 'products') {
    if (isLiveFirebaseConfigured && storage) {
      try {
        const cleanName = (file.name || 'image.png').replace(/[^a-zA-Z0-9._-]/g, '_');
        const storageRef = ref(storage, `${folder}/${Date.now()}_${cleanName}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Firebase storage upload failed, converting to DataURL:', err);
      }
    }
    // Fallback: Read as base64 DataURL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async uploadPaymentProof(file) {
    return this.upload(file, 'payment_proofs');
  }
};

export { app, db, auth, storage };
