// IndexedDB and LocalStorage persistent image storage for high-res photos

const DB_NAME = 'ggw_assets_db';
const STORE_NAME = 'photos';
const PHOTO_KEY = 'ggw_official_store_photo_v2';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSavedStorePhoto(): Promise<string | null> {
  // 1. Try IndexedDB first (handles large images)
  try {
    const db = await openDB();
    const val = await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(PHOTO_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    if (val) return val;
  } catch (err) {
    // Ignore IndexedDB error and fallback
  }

  // 2. Fallback to localStorage safely
  try {
    const local = localStorage.getItem(PHOTO_KEY);
    if (local) return local;
  } catch (err) {
    // Ignore quota or security errors
  }

  // 3. Fallback to bundled static asset (works on GitHub, GitHub Pages, Vercel, Netlify, and Cloud Run)
  return '/assets/ggw_storefront_truck.jpg';
}

export async function saveStorePhoto(dataUrl: string): Promise<void> {
  // 1. Save in IndexedDB (no 5MB quota restrictions)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, PHOTO_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[ImageStorage] IndexedDB save failed:', err);
  }

  // 2. Safely attempt localStorage (only if under size limit, catch QuotaExceededError)
  try {
    if (dataUrl.length < 2 * 1024 * 1024) { // only store if < 2MB to prevent quota crash
      localStorage.setItem(PHOTO_KEY, dataUrl);
    }
  } catch (err) {
    console.warn('[ImageStorage] LocalStorage quota exceeded, relying on IndexedDB and server.');
  }

  // 3. Dispatch global event so all components update immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ggw_storage_updated', { detail: { photoUrl: dataUrl } }));
  }
}

export async function uploadStorePhotoFile(file: File): Promise<string> {
  // Convert to Base64 for persistent server write
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Save locally first
  await saveStorePhoto(base64);

  // Send to server
  try {
    const res = await fetch('/api/upload-storefront-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        filename: file.name
      })
    });
    if (res.ok) {
      const data = await res.json();
      // Dispatch server URL or keep base64
      return base64;
    }
  } catch (err) {
    console.error('[ImageStorage] Server upload failed:', err);
  }

  return base64;
}
