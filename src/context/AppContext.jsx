/**
 * AppContext — État global de l'application
 * Connecté aux services (mock/API selon VITE_USE_MOCK)
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setToken, getToken, isAuthenticated, onAuthExpired } from '../api/client';
import { auth, cart as cartSvc, social as socialSvc } from '../services';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ── Auth ──
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState(isAuthenticated() ? 'loading' : 'splash');
  const [socialProvider, setSocialProvider] = useState(null);

  // ── Navigation ──
  const [mode, setMode] = useState('buyer');
  const [tab, setTab] = useState(0);
  const [vTab, setVTab] = useState(0);
  const [dTab, setDTab] = useState(0);
  const [screen, setScreen] = useState(null);
  const [history, setHistory] = useState([]);

  // ── Cart ──
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // normalize items returned by backend/mock so UI has consistent fields
  const normalizeCartItem = i => {
    const prod = i.product || {};
    return {
      ...i,
      product: {
        id: prod.id || i.article_id,
        name: prod.name || i.name || prod.title,
        price: prod.price ?? i.price ?? 0,
        old: prod.old_price || prod.old || i.old || 0,
        img: prod.img || prod.image || i.img || "",
        photo: prod.photo || prod.image || prod.img || i.photo || null,
        vendor: prod.vendor || i.vendor || "",
      },
      price: i.price || prod.price || 0,
    };
  };

  // ── Favorites ──
  const [favs, setFavs] = useState([]);

  // ── Roles ──
  const [userRole, setUserRole] = useState('client');
  const [vendorPlan, setVendorPlan] = useState('starter');
  const [vendorStatus, setVendorStatus] = useState('none');
  const [driverStatus, setDriverStatus] = useState('none');

  // ── Notifications ──
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ══════════════════════════════════
  //  BOOT — Restaurer session
  // ══════════════════════════════════

  useEffect(() => {
    if (!isAuthenticated()) return;

    (async () => {
      try {
        const userData = await auth.getMe();
        setUser(userData);
        setUserRole(userData.role || 'client');
        setAuthStep('ready');

        const [cartData, favsData, notifData] = await Promise.allSettled([
          cartSvc.get(),
          socialSvc.getFavorites(),
          socialSvc.getUnreadCount(),
        ]);

        if (cartData.status === 'fulfilled' && cartData.value) {
          const items = (cartData.value.items || []).map(normalizeCartItem);
          setCart(items);
          setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
        }
        if (favsData.status === 'fulfilled') {
          setFavs((favsData.value || []).map(a => a.id));
        }
        if (notifData.status === 'fulfilled') {
          setUnreadCount(notifData.value?.count || 0);
        }
      } catch {
        setToken(null);
        setAuthStep('login');
      }
    })();
  }, []);

  useEffect(() => {
    onAuthExpired(() => {
      setUser(null);
      setAuthStep('login');
      showToast('Session expirée, reconnectez-vous', 'error');
    });
  }, []);

  // ══════════════════════════════════
  //  AUTH ACTIONS
  // ══════════════════════════════════

  const login = useCallback(async (token, userData, isNew) => {
    setToken(token);
    setUser(userData);
    setUserRole(userData.role || 'client');
    if (isNew || !userData.first_name) {
      setAuthStep('profile');
    } else {
      setAuthStep('ready');
      try {
        const [c, f] = await Promise.all([cartSvc.get(), socialSvc.getFavorites()]);
        setCart(c?.items || []); setCartCount((c?.items || []).reduce((s, i) => s + (i.qty || 1), 0));
        setFavs((f || []).map(a => a.id));
      } catch {}
    }
  }, []);

  const completeProfile = useCallback(async (data) => {
    const userData = await auth.completeProfile(data);
    setUser(userData);
    setAuthStep('ready');
  }, []);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch {}
    setToken(null);
    setUser(null);
    setAuthStep('login');
    setMode('buyer'); setTab(0); setScreen(null); setHistory([]);
    setCart([]); setFavs([]); setCartCount(0);
    setUserRole('client'); setVendorStatus('none'); setDriverStatus('none');
  }, []);

  // ══════════════════════════════════
  //  NAVIGATION
  // ══════════════════════════════════

  const go = useCallback((type, data) => {
    setHistory(h => [...h, screen]);
    setScreen({ type, data });
  }, [screen]);

  const pop = useCallback(() => {
    setHistory(h => {
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev || null);
      return copy;
    });
  }, []);

  const goHome = useCallback(() => {
    setScreen(null); setTab(0); setVTab(0); setDTab(0); setHistory([]);
  }, []);

  const switchMode = useCallback((m) => {
    setMode(m); setScreen(null); setHistory([]);
    setTab(0); setVTab(0); setDTab(0);
  }, []);

  // ══════════════════════════════════
  //  CART ACTIONS (via services)
  // ══════════════════════════════════

  const addToCart = useCallback(async (article, qty = 1) => {
    // ensure article contains price/photo/img for UI
    const normalized = {
      ...article,
      price: article.price ?? article.prix ?? 0,
      photo: article.photo || article.photos?.[0] || null,
      img: article.img || article.image || article.photo || null,
    };
    try {
      await cartSvc.add(normalized.id, qty);
      const data = await cartSvc.get();
      const items = (data?.items || []).map(normalizeCartItem);
      setCart(items); setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
      showToast('Ajouté au panier 🛍️');
      setScreen(null); setHistory([]); setTab(2);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  const updateCartQty = useCallback(async (id, quantity) => {
    try {
      if (quantity < 1) { await cartSvc.remove(id); }
      else { await cartSvc.updateQty(id, quantity); }
      const data = await cartSvc.get();
      const items = (data?.items || []).map(normalizeCartItem);
      setCart(items); setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
    } catch {}
  }, []);

  const clearCart = useCallback(async () => {
    await cartSvc.clear();
    setCart([]); setCartCount(0);
  }, []);

  // ══════════════════════════════════
  //  FAVORITES (via services)
  // ══════════════════════════════════

  const toggleFav = useCallback(async (articleId) => {
    try {
      const result = await socialSvc.toggleFavorite(articleId);
      setFavs(prev => result.is_favorite
        ? [...prev, articleId]
        : prev.filter(id => id !== articleId)
      );
    } catch {}
  }, []);

  const isFav = useCallback((articleId) => favs.includes(articleId), [favs]);

  // ══════════════════════════════════
  //  ROLES
  // ══════════════════════════════════

  const onRoleApproved = useCallback((role, plan) => {
    if (role === 'vendor') {
      setUserRole(r => r === 'driver' ? 'both' : 'vendor');
      setVendorPlan(plan || 'starter');
      setVendorStatus('approved');
    }
    if (role === 'driver') {
      setUserRole(r => r === 'vendor' ? 'both' : 'driver');
      setDriverStatus('approved');
    }
  }, []);

  const hasVendor = (userRole === 'vendor' || userRole === 'both') && vendorStatus === 'approved';
  const hasDriver = (userRole === 'driver' || userRole === 'both') && driverStatus === 'approved';

  // ══════════════════════════════════
  //  CONTEXT VALUE
  // ══════════════════════════════════

  const value = {
    user, authStep, setAuthStep, socialProvider, setSocialProvider,
    login, completeProfile, logout,
    mode, setMode: switchMode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, history, setHistory, go, pop, goHome, switchTo: switchMode,
    cart, setCart, cartCount, addToCart, updateCartQty, clearCart,
    favs, toggleFav, isFav,
    userRole, vendorPlan, setVendorPlan, vendorStatus, driverStatus,
    onRoleApproved, hasVendor, hasDriver,
    unreadCount, setUnreadCount,
    toast, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
