/**
 * Universal Auto-Update & Over-The-Air (OTA) Delivery Service
 * Ensures that all users (both installed Android APK and PWA/Web users)
 * automatically receive the latest updates, fixes, and features.
 */

export interface AppUpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
  isPwaUpdate?: boolean;
}

export const CURRENT_APP_VERSION = '2.1.0';
const GITHUB_REPO = 'shahin134053/WeatherGuro';
const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes

type UpdateListener = (update: AppUpdateInfo | null) => void;
const listeners: Set<UpdateListener> = new Set();
let currentUpdateInfo: AppUpdateInfo | null = null;
let waitingWorker: ServiceWorker | null = null;

export function subscribeUpdateStatus(listener: UpdateListener): () => void {
  listeners.add(listener);
  listener(currentUpdateInfo);
  return () => {
    listeners.delete(listener);
  };
}

function notifyUpdate(info: AppUpdateInfo | null) {
  currentUpdateInfo = info;
  listeners.forEach((fn) => {
    try {
      fn(info);
    } catch (e) {
      console.warn('Update listener notification error:', e);
    }
  });
}

/**
 * Register the Service Worker and listen for background updates
 */
export function registerAutoUpdateServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Avoid registering SW in development mode if not desired, but here we enable for full PWA support
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('WeatherGuru ServiceWorker registered successfully');

        // Check for updates on register
        registration.update().catch(() => {});

        // Periodic update check
        setInterval(() => {
          registration.update().catch(() => {});
        }, UPDATE_CHECK_INTERVAL_MS);

        // If an update is already waiting (installed in background)
        if (registration.waiting) {
          waitingWorker = registration.waiting;
          notifyUpdate({
            hasUpdate: true,
            currentVersion: CURRENT_APP_VERSION,
            latestVersion: 'New Update',
            releaseNotes: 'নতুন আবহাওয়া ফিচার ও অডিও ফিক্স সক্রিয় করার জন্য আপডেট করুন।',
            isPwaUpdate: true,
          });
        }

        // Listen for new worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                waitingWorker = newWorker;
                notifyUpdate({
                  hasUpdate: true,
                  currentVersion: CURRENT_APP_VERSION,
                  latestVersion: 'New Update',
                  releaseNotes: 'নতুন আবহাওয়া ফিচার ও অডিও ফিক্স সক্রিয় করার জন্য আপডেট করুন।',
                  isPwaUpdate: true,
                });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('ServiceWorker registration notice:', err);
      });

    // Handle controller change (when new SW takes over, reload to apply fresh files)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });

  // Also check whenever user returns to the app / window focuses
  window.addEventListener('focus', () => {
    checkForRemoteAppUpdates().catch(() => {});
  });
}

/**
 * Check GitHub Release API for new APK releases for installed mobile users
 */
export async function checkForRemoteAppUpdates(): Promise<AppUpdateInfo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    const tagName = data.tag_name || '';
    const releaseName = data.name || tagName;

    // Look for Android APK asset
    const apkAsset = data.assets?.find((a: any) => a.name?.endsWith('.apk'));
    const downloadUrl = apkAsset?.browser_download_url || `https://github.com/${GITHUB_REPO}/releases/latest/download/WeatherGuru-Gold-Android.apk`;

    // Detect if this is an installed native app (Capacitor)
    const isNativeApp =
      typeof window !== 'undefined' &&
      ((window.location.hostname === 'localhost' && !window.location.port) ||
        window.location.protocol.startsWith('capacitor') ||
        Boolean((window as any).Capacitor?.isNativePlatform?.()));

    // If native app and release is present, or check semver
    if (isNativeApp && tagName) {
      const update: AppUpdateInfo = {
        hasUpdate: true,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: releaseName,
        releaseNotes: 'অডিও ভয়েস ফিক্স, উন্নত পারফরম্যান্স ও স্বয়ংক্রিয় ক্লাউড পূর্বাভাস অন্তর্ভুক্ত রয়েছে।',
        downloadUrl,
        isPwaUpdate: false,
      };
      notifyUpdate(update);
      return update;
    }

    return null;
  } catch (err) {
    console.warn('Auto-update check notice:', err);
    return null;
  }
}

/**
 * Apply the pending update
 */
export function applyAppUpdate(): void {
  if (currentUpdateInfo?.isPwaUpdate && waitingWorker) {
    // Send skipWaiting message to waiting ServiceWorker
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  } else if (currentUpdateInfo?.downloadUrl) {
    // Trigger download of the latest APK on mobile device
    window.location.href = currentUpdateInfo.downloadUrl;
  } else {
    window.location.reload();
  }
}

/**
 * Dismiss the current update prompt for this session
 */
export function dismissUpdate(): void {
  notifyUpdate(null);
}
