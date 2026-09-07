/**
 * Media Service for GLOBAL GLASS AND WINDOWS
 * Handles client-side high-fidelity image compression, video thumbnail extraction,
 * and persistent storage (IndexedDB + Memory Cache) so all imported files display reliably.
 */

const DB_NAME = 'ggw_media_database_v2';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';
const APP_DATA_STORE = 'app_data_store';

// In-memory media cache for instantaneous synchronous lookups
const mediaCache = new Map<string, string>();

/**
 * Reads a File directly as a Data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an SVG poster for videos as instantaneous fallback
 */
export function createDefaultVideoPoster(title: string): string {
  const cleanTitle = (title || 'Vidéo Produit')
    .replace(/<[^>]*>?/gm, '')
    .slice(0, 32);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#230331" />
        <stop offset="100%" stop-color="#3b0852" />
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)"/>
    <circle cx="320" cy="150" r="44" fill="#B6D232" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"/>
    <polygon points="312,132 338,150 312,168" fill="#230331"/>
    <text x="320" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle">${cleanTitle}</text>
    <text x="320" y="265" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#B6D232" text-anchor="middle">GLOBAL GLASS AND WINDOWS • VIDÉO</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Compresses an image file client-side to max 1600px dimension and high-quality JPEG
 * Dramatically reduces 5-15MB phone camera photos to ~100-250KB without perceptible quality loss.
 * Prevents localStorage QuotaExceededError and ensures instantaneous rendering in <img> tags.
 */
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  // If SVG, read as DataURL directly
  if (file.type === 'image/svg+xml') {
    return fileToDataURL(file);
  }

  // If small GIF, preserve animation
  if (file.type === 'image/gif' && file.size < 800 * 1024) {
    return fileToDataURL(file);
  }

  return new Promise((resolve) => {
    let objectUrl = '';
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      fileToDataURL(file).then(resolve).catch(() => resolve(''));
      return;
    }

    const img = new Image();

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      }
    };

    img.onload = () => {
      cleanup();
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          fileToDataURL(file).then(resolve).catch(() => resolve(''));
          return;
        }

        // Calculate proportionate dimensions within maxDim
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          fileToDataURL(file).then(resolve).catch(() => resolve(''));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (or PNG if original was PNG and small)
        const format = (file.type === 'image/png' && file.size < 600 * 1024) ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(format, quality);

        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Canvas compression error, falling back to data URL:', err);
        fileToDataURL(file).then(resolve).catch(() => resolve(''));
      }
    };

    img.onerror = () => {
      cleanup();
      fileToDataURL(file).then(resolve).catch(() => resolve(''));
    };

    img.src = objectUrl;
  });
}

/**
 * Extracts a real visual thumbnail snapshot from a video file
 */
export async function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    let objectUrl = '';
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      resolve(createDefaultVideoPoster(file.name));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;
    video.crossOrigin = 'anonymous';

    let resolved = false;

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      }
      video.remove();
    };

    // Safety timeout in case browser codec cannot seek this video format
    const fallbackTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(createDefaultVideoPoster(file.name));
      }
    }, 3000);

    video.onloadedmetadata = () => {
      // Seek to 0.5s or midpoint for a meaningful frame
      const targetTime = Math.min(1.0, (video.duration && video.duration > 1) ? 0.8 : (video.duration || 0) / 2);
      try {
        video.currentTime = targetTime;
      } catch {
        // Seek not supported on this video
      }
    };

    video.onseeked = () => {
      if (resolved) return;
      try {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;

        if (width > 0 && height > 0) {
          const canvas = document.createElement('canvas');
          const targetWidth = Math.min(width, 800);
          const targetHeight = Math.round((targetWidth * height) / width);

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolved = true;
            clearTimeout(fallbackTimer);
            cleanup();
            resolve(thumbUrl);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not grab video frame, using fallback poster:', err);
      }

      resolved = true;
      clearTimeout(fallbackTimer);
      cleanup();
      resolve(createDefaultVideoPoster(file.name));
    };

    video.onerror = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(fallbackTimer);
      cleanup();
      resolve(createDefaultVideoPoster(file.name));
    };

    video.src = objectUrl;
  });
}

/**
 * Open or initialize IndexedDB instance
 */
function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(APP_DATA_STORE)) {
          db.createObjectStore(APP_DATA_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error, continuing with memory cache:', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB initialization failed:', err);
      resolve(null);
    }
  });
}

/**
 * Save large media (Blob, Video, or DataURL) to IndexedDB
 */
export async function saveMediaToIndexedDB(id: string, data: string | Blob): Promise<string> {
  // Always update memory cache for instantaneous retrieval
  if (typeof data === 'string') {
    mediaCache.set(id, data);
  }

  const db = await openIndexedDB();
  if (!db) return typeof data === 'string' ? data : '';

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, data, updatedAt: Date.now() });

      req.onsuccess = () => resolve(typeof data === 'string' ? data : id);
      req.onerror = () => {
        console.warn('IndexedDB put error:', req.error);
        resolve(typeof data === 'string' ? data : '');
      };
    } catch (err) {
      console.warn('IndexedDB transaction error:', err);
      resolve(typeof data === 'string' ? data : '');
    }
  });
}

/**
 * Retrieve media by ID from Memory Cache or IndexedDB
 */
export async function getMediaFromIndexedDB(id: string): Promise<string | null> {
  if (mediaCache.has(id)) {
    return mediaCache.get(id) || null;
  }

  const db = await openIndexedDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          const val = req.result.data;
          if (typeof val === 'string') {
            mediaCache.set(id, val);
            resolve(val);
          } else if (val instanceof Blob) {
            const url = URL.createObjectURL(val);
            mediaCache.set(id, url);
            resolve(url);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * High-level function to process any imported File (image or video)
 * Returns a display-ready URL and video metadata
 */
export async function processImportedFile(file: File): Promise<{
  url: string;
  isVideo: boolean;
  thumbnailUrl?: string;
  name: string;
}> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg|3gp)$/i.test(file.name);
  const cleanName = file.name.replace(/\.[^/.]+$/, '');

  if (isVideo) {
    // Generate real thumbnail frame
    const thumbnail = await extractVideoThumbnail(file);

    // Read video content
    let videoUrl = '';
    try {
      videoUrl = await fileToDataURL(file);
      // Also store in IndexedDB
      const mediaId = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await saveMediaToIndexedDB(mediaId, videoUrl);
    } catch (err) {
      console.warn('Video DataURL read error, using blob URL fallback:', err);
      videoUrl = URL.createObjectURL(file);
    }

    return {
      url: videoUrl,
      isVideo: true,
      thumbnailUrl: thumbnail,
      name: cleanName
    };
  } else {
    // It's an image: compress to crisp, lightweight Data URL
    const compressedUrl = await compressImage(file, 1600, 0.82);
    const mediaId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await saveMediaToIndexedDB(mediaId, compressedUrl);

    return {
      url: compressedUrl,
      isVideo: false,
      name: cleanName
    };
  }
}
