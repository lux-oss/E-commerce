/**
 * Cart Service
 */
import { USE_MOCK, delay } from './config';
import { cartAPI } from '../api';
import { P } from '../data/products';

let _mockCart = [];

export default {
  get: async () => {
    if (USE_MOCK) { await delay(); return { items: _mockCart, total: _mockCart.reduce((s, i) => s + i.price * i.qty, 0) }; }
    return cartAPI.get();
  },

  add: async (articleId, quantity = 1, note = '') => {
    if (USE_MOCK) {
      await delay();
      const existing = _mockCart.find(i => i.article_id === articleId);
      if (existing) { existing.qty += quantity; }
      else {
        const article = P.find(p => p.id === articleId);
        if (!article) throw new Error("Article introuvable");
        _mockCart.push({ id: "mc" + Date.now(), article_id: articleId, name: article.name, price: article.price, img: article.img, photo: article.photo, qty: quantity, note });
      }
      return { count: _mockCart.reduce((s, i) => s + i.qty, 0) };
    }
    return cartAPI.add(articleId, quantity, note);
  },

  updateQty: async (itemId, quantity) => {
    if (USE_MOCK) { await delay(); const item = _mockCart.find(i => i.id === itemId); if (item) item.qty = quantity; return; }
    return cartAPI.updateQty(itemId, quantity);
  },

  remove: async (itemId) => {
    if (USE_MOCK) { await delay(); _mockCart = _mockCart.filter(i => i.id !== itemId); return; }
    return cartAPI.remove(itemId);
  },

  clear: async () => {
    if (USE_MOCK) { _mockCart = []; return; }
    return cartAPI.clear();
  },

  count: async () => {
    if (USE_MOCK) { return { count: _mockCart.reduce((s, i) => s + i.qty, 0) }; }
    return cartAPI.count();
  },
};
