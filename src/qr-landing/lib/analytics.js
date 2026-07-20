const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export function track(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
  if (isLocal) {
    console.log('[analytics]', eventName, params);
  }
}
