/**
 * Services Config — Lamuka Market
 *
 * VITE_USE_MOCK=true  → données statiques (dev/démo)
 * VITE_USE_MOCK=false → appels API réels (production)
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/lamuka-api/api/v1';
export const MOCK_DELAY = 300;
export const delay = (ms) => new Promise(r => setTimeout(r, ms || MOCK_DELAY));
