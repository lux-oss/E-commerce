/**
 * Social Service — Favoris, Followers, Avis, Chat, Notifications
 */
import { USE_MOCK, delay } from './config';
import { favoritesAPI, followersAPI, reviewsAPI, chatAPI, notificationsAPI, driverReviewsAPI } from '../api';
import { P } from '../data/products';
import REVIEWS from '../data/reviews';
import CHATS from '../data/chats';
import NOTIFS from '../data/notifications';

let _mockFavs = ["p2", "p5"];

export default {
  // ── Favoris ──
  getFavorites: async () => {
    if (USE_MOCK) { await delay(); return P.filter(p => _mockFavs.includes(p.id)); }
    return favoritesAPI.getAll();
  },
  toggleFavorite: async (articleId) => {
    if (USE_MOCK) {
      await delay(150);
      const idx = _mockFavs.indexOf(articleId);
      if (idx >= 0) { _mockFavs.splice(idx, 1); return { is_favorite: false }; }
      _mockFavs.push(articleId); return { is_favorite: true };
    }
    return favoritesAPI.toggle(articleId);
  },
  isFavorite: (articleId) => _mockFavs.includes(articleId),

  // ── Followers ──
  getFollowing: async () => {
    if (USE_MOCK) { await delay(); return []; }
    return followersAPI.getFollowing();
  },
  toggleFollow: async (establishmentId) => {
    if (USE_MOCK) { await delay(150); return { is_following: true }; }
    return followersAPI.toggle(establishmentId);
  },
  isFollowing: async (establishmentId) => {
    if (USE_MOCK) return false;
    return followersAPI.check(establishmentId);
  },

  // ── Avis ──
  getArticleReviews: async (articleId, page = 1, sort = 'newest') => {
    if (USE_MOCK) { await delay(); return { reviews: REVIEWS, pagination: { page, total: REVIEWS.length, has_more: false } }; }
    return reviewsAPI.getByArticle(articleId, page, sort);
  },
  getReviewStats: async (articleId) => {
    if (USE_MOCK) {
      await delay();
      return { average: 4.6, total: REVIEWS.length, distribution: { 5: 12, 4: 5, 3: 2, 2: 1, 1: 0 } };
    }
    return reviewsAPI.getStats(articleId);
  },
  createReview: async (data) => {
    if (USE_MOCK) { await delay(400); return { id: "r" + Date.now(), ...data, date: "Maintenant" }; }
    return reviewsAPI.create(data);
  },
  createDriverReview: async (deliveryId, rating, comment, tip) => {
    if (USE_MOCK) { await delay(400); return { success: true }; }
    return driverReviewsAPI.create(deliveryId, rating, comment, tip);
  },

  // ── Chat ──
  getConversations: async () => {
    if (USE_MOCK) { await delay(); return CHATS; }
    return chatAPI.getConversations();
  },
  getMessages: async (convId, page = 1) => {
    if (USE_MOCK) {
      await delay();
      return { messages: [
        { id: "m1", sender: "them", content: "Bonjour ! Votre commande est prête.", time: "14:30" },
        { id: "m2", sender: "me", content: "Merci ! Je passe dans 10 min.", time: "14:32" },
        { id: "m3", sender: "them", content: "Parfait, à tout de suite !", time: "14:33" },
      ], pagination: { page, has_more: false } };
    }
    return chatAPI.getMessages(convId, page);
  },
  sendMessage: async (convId, content, type = 'text') => {
    if (USE_MOCK) { await delay(200); return { id: "m" + Date.now(), sender: "me", content, type, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }; }
    return chatAPI.send(convId, content, type);
  },
  markRead: async (convId) => {
    if (USE_MOCK) return;
    return chatAPI.markRead(convId);
  },

  // ── Notifications ──
  getNotifications: async (unreadOnly = false, page = 1) => {
    if (USE_MOCK) { await delay(); const items = unreadOnly ? NOTIFS.filter(n => !n.read) : NOTIFS; return { notifications: items, pagination: { page, total: items.length, has_more: false } }; }
    return notificationsAPI.getAll(unreadOnly, page);
  },
  getUnreadCount: async () => {
    if (USE_MOCK) { return { count: NOTIFS.filter(n => !n.read).length }; }
    return notificationsAPI.count();
  },
  markNotifRead: async (id) => {
    if (USE_MOCK) { const n = NOTIFS.find(n => n.id === id); if (n) n.read = true; return; }
    return notificationsAPI.read(id);
  },
  markAllRead: async () => {
    if (USE_MOCK) { NOTIFS.forEach(n => n.read = true); return; }
    return notificationsAPI.readAll();
  },
};
