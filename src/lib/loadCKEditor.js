// Singleton loader for the CKEditor 5 Decoupled Document CDN build.
//
// Injecting the CDN <script> from each form component races: `window.DecoupledEditor`
// only exists AFTER the async script loads, so a second mount (React StrictMode
// double-invoke, Fast Refresh, or navigating between forms) could append a second
// <script> before the first finished — loading CKEditor twice and triggering the
// `ckeditor-duplicated-modules` error.
//
// This memoizes the load into a single module-level promise, so no matter how many
// components/effects call it, the script is injected exactly once app-wide.

const CKEDITOR_SRC =
  'https://cdn.jsdelivr.net/npm/@ckeditor/ckeditor5-build-decoupled-document@36.0.1/build/ckeditor.js';

let loadPromise = null;

// Resolves with window.DecoupledEditor once the CDN build is ready.
export function loadCKEditor() {
  if (typeof window === 'undefined') return Promise.resolve(null);

  // Already loaded in this session.
  if (window.DecoupledEditor) return Promise.resolve(window.DecoupledEditor);

  // A load is already in flight (or completed) — reuse it.
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // Reuse an existing tag if one is already in the DOM (e.g. after HMR).
    const existing = document.querySelector('script[data-ckeditor]');
    const script = existing || document.createElement('script');

    const onLoaded = () => resolve(window.DecoupledEditor);
    const onFailed = () => {
      loadPromise = null; // allow a retry on the next call
      reject(new Error('Failed to load CKEditor from CDN'));
    };

    if (window.DecoupledEditor) {
      resolve(window.DecoupledEditor);
      return;
    }

    script.addEventListener('load', onLoaded, { once: true });
    script.addEventListener('error', onFailed, { once: true });

    if (!existing) {
      script.src = CKEDITOR_SRC;
      script.async = true;
      script.dataset.ckeditor = 'true';
      document.head.appendChild(script);
    }
  });

  return loadPromise;
}
