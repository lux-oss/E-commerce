/**
 * Catalog Service — Catégories, Articles, Établissements, Recherche
 */
import { USE_MOCK, delay } from './config';
import { categoriesAPI, articlesAPI, establishmentsAPI, searchAPI } from '../api';
import CATS from '../data/categories';
import { P } from '../data/products';
import { V } from '../data/vendors';

export default {
  // ── Catégories ──
  getCategories: async (type) => {
    if (USE_MOCK) { await delay(); return type ? CATS.filter(c => c.type === type) : CATS; }
    return categoriesAPI.getAll(type);
  },

  getCategoryDetail: async (id, page = 1) => {
    if (USE_MOCK) {
      await delay();
      const cat = CATS.find(c => c.id === id);
      const items = P.filter(p => p.cat === cat?.name);
      return { category: cat, articles: items, pagination: { page, total: items.length, has_more: false } };
    }
    return categoriesAPI.getDetail(id, page);
  },

  // ── Articles ──
  searchArticles: async (filters = {}) => {
    if (USE_MOCK) {
      await delay();
      let items = [...P];
      if (filters.search) { const q = filters.search.toLowerCase(); items = items.filter(p => p.name.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q)); }
      if (filters.type) items = items.filter(p => p.type === filters.type);
      if (filters.category) items = items.filter(p => p.cat === filters.category);
      if (filters.min_price) items = items.filter(p => p.price >= Number(filters.min_price));
      if (filters.max_price) items = items.filter(p => p.price <= Number(filters.max_price));
      if (filters.sort === 'price_asc') items.sort((a, b) => a.price - b.price);
      else if (filters.sort === 'price_desc') items.sort((a, b) => b.price - a.price);
      else if (filters.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
      return { articles: items, pagination: { page: 1, total: items.length, has_more: false } };
    }
    return articlesAPI.search(filters);
  },

  getArticle: async (id) => {
    if (USE_MOCK) { await delay(); const a = P.find(p => p.id === id); if (!a) throw new Error("Article introuvable"); return { article: a, images: [], variants: a.variants || [], is_favorite: false }; }
    return articlesAPI.getDetail(id);
  },

  getPopular: async () => {
    if (USE_MOCK) { await delay(); return P.filter(p => p.tags?.includes("Populaire") || p.tags?.includes("⭐ Best-seller")).slice(0, 10); }
    return articlesAPI.getPopular();
  },

  getFlashSales: async () => {
    if (USE_MOCK) { await delay(); return P.filter(p => p.old).slice(0, 6); }
    return articlesAPI.getFlash();
  },

  // ── Établissements ──
  getEstablishments: async (filters = {}) => {
    if (USE_MOCK) {
      await delay();
      let items = [...V];
      if (filters.type) items = items.filter(v => v.type === filters.type);
      if (filters.search) { const q = filters.search.toLowerCase(); items = items.filter(v => v.name.toLowerCase().includes(q)); }
      return items;
    }
    return establishmentsAPI.getAll(filters);
  },

  getEstablishment: async (id) => {
    if (USE_MOCK) { await delay(); const v = V.find(v => v.id === id); if (!v) throw new Error("Établissement introuvable"); return v; }
    return establishmentsAPI.getDetail(id);
  },

  getEstablishmentArticles: async (id, page = 1) => {
    if (USE_MOCK) { await delay(); const v = V.find(v => v.id === id); return P.filter(p => p.vendor === v?.name); }
    return establishmentsAPI.getArticles(id, page);
  },

  getNearby: async (lat, lng, radius = 10) => {
    if (USE_MOCK) { await delay(); return V.filter(v => v.lat && v.lng); }
    return establishmentsAPI.getNearby(lat, lng, radius);
  },

  // ── Recherche ──
  getSearchHistory: async () => {
    if (USE_MOCK) { await delay(); return ["Smartphone", "Robe Wax", "Poulet DG"]; }
    return searchAPI.getHistory();
  },

  clearSearchHistory: async () => {
    if (USE_MOCK) { await delay(); return; }
    return searchAPI.clearHistory();
  },

  markViewed: async (articleId) => {
    if (USE_MOCK) return;
    return searchAPI.markViewed(articleId);
  },

  getRecentlyViewed: async () => {
    if (USE_MOCK) { await delay(); return P.slice(0, 4); }
    return searchAPI.getRecentlyViewed();
  },
};
