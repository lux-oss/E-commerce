/**
 * useData — Hook global pour les données catalogue
 * 
 * Charge les catégories, articles, établissements via les services
 * et les rend disponibles de manière synchrone aux écrans.
 * 
 * Usage:
 *   import { useData } from '../hooks';
 *   const { P, VENDORS, CATS, loading, reload } = useData();
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { catalog, vendor, driver, social, user as userSvc, order as orderSvc } from '../services';

// ── Cache global partagé entre instances du hook ──
const cache = {
  cats: null,
  products: null,
  vendors: null,
  loaded: false,
  loading: false,
  listeners: new Set(),
};

function notifyListeners() {
  cache.listeners.forEach(fn => fn({}));
}

async function loadCatalog() {
  if (cache.loaded || cache.loading) return;
  cache.loading = true;
  notifyListeners();

  try {
    const [cats, prodResult, vendors] = await Promise.all([
      catalog.getCategories(),
      catalog.searchArticles({}),
      catalog.getEstablishments({}),
    ]);
    cache.cats = cats || [];
    cache.products = prodResult?.articles || prodResult || [];
    cache.vendors = vendors || [];
    cache.loaded = true;
  } catch (err) {
    console.error('useData: failed to load catalog', err);
  } finally {
    cache.loading = false;
    notifyListeners();
  }
}

export function useData() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    cache.listeners.add(forceUpdate);
    if (!cache.loaded && !cache.loading) loadCatalog();
    return () => cache.listeners.delete(forceUpdate);
  }, []);

  const reload = useCallback(async () => {
    cache.loaded = false;
    cache.loading = false;
    await loadCatalog();
  }, []);

  return {
    CATS: cache.cats || [],
    P: cache.products || [],
    VENDORS: cache.vendors || [],
    loading: cache.loading,
    loaded: cache.loaded,
    reload,

    // Proxy vers services pour les appels ponctuels
    catalog,
    vendor,
    driver,
    social,
    userSvc,
    orderSvc,
  };
}

/**
 * useLoad — Hook pour charger une donnée spécifique au mount
 * 
 * Usage:
 *   const { data, loading, error, reload } = useLoad(() => vendor.getOrders('new'));
 */
export function useLoad(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load, setData };
}

/**
 * useAction — Hook pour actions manuelles (POST/PUT/DELETE)
 * 
 * Usage:
 *   const { run, loading } = useAction();
 *   await run(() => vendor.updateOrderStatus(id, 'preparing'));
 */
export function useAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (action) => {
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Erreur');
      setLoading(false);
      throw err;
    }
  }, []);

  return { run, loading, error };
}

export default useData;
