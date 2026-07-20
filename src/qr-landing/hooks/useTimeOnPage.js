import { useEffect } from 'react';
import { track } from '../lib/analytics';

// Rough time-on-page, sent when the visitor leaves.
export function useTimeOnPage() {
  useEffect(() => {
    const startedAt = Date.now();
    function handlePageHide() {
      track('tiempo_en_pagina', { value: Math.round((Date.now() - startedAt) / 1000) });
    }
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);
}
