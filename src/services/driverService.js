/**
 * Driver Service — Dashboard, Livraisons, Zones, Véhicule, Wallet, Stats
 */
import { USE_MOCK, delay } from './config';
import { driverAPI } from '../api';
import { D_DELIVERIES, D_HISTORY, D_STATS, D_NOTIFS } from '../data/driverData';

export default {
  // ── Inscription ──
  register: async (data) => {
    if (USE_MOCK) { await delay(600); return { driver_id: "d" + Date.now(), status: "pending_review", ...data }; }
    return driverAPI.register(data);
  },

  // ── Dashboard ──
  getDashboard: async () => {
    if (USE_MOCK) {
      await delay();
      return {
        stats: D_STATS.today,
        active: D_DELIVERIES.find(d => d.status === "active") || null,
        pending: D_DELIVERIES.find(d => d.status === "pending") || null,
        is_available: true,
      };
    }
    return driverAPI.dashboard();
  },

  // ── Livraisons ──
  getAvailable: async () => {
    if (USE_MOCK) { await delay(); return D_DELIVERIES.filter(d => d.status === "pending"); }
    return driverAPI.available();
  },

  acceptDelivery: async (id) => {
    if (USE_MOCK) {
      await delay(400);
      const d = D_DELIVERIES.find(d => d.id === id);
      if (d) d.status = "active";
      return { success: true };
    }
    return driverAPI.acceptDelivery(id);
  },

  pickup: async (id, code) => {
    if (USE_MOCK) {
      await delay(400);
      if (code !== "1234" && code.length < 4) throw new Error("Code invalide");
      return { success: true };
    }
    return driverAPI.pickup(id, code);
  },

  deliver: async (id, code) => {
    if (USE_MOCK) {
      await delay(400);
      const d = D_DELIVERIES.find(d => d.id === id);
      if (d) d.status = "delivered";
      return { success: true };
    }
    return driverAPI.deliver(id, code);
  },

  getHistory: async (page = 1) => {
    if (USE_MOCK) { await delay(); return { deliveries: D_HISTORY, pagination: { page, total: D_HISTORY.length, has_more: false } }; }
    return driverAPI.history(page);
  },

  // ── Localisation ──
  updateLocation: async (lat, lng) => {
    if (USE_MOCK) return;
    return driverAPI.updateLocation(lat, lng);
  },

  setAvailability: async (available) => {
    if (USE_MOCK) { await delay(200); return { is_available: available }; }
    return driverAPI.setAvailability(available);
  },

  // ── Zones ──
  getZones: async () => {
    if (USE_MOCK) { await delay(); return [{ id: "z1", name: "Bacongo", active: true }, { id: "z2", name: "Poto-Poto", active: true }, { id: "z3", name: "Moungali", active: false }]; }
    return driverAPI.zones();
  },

  addZone: async (zoneName) => {
    if (USE_MOCK) { await delay(); return { id: "z" + Date.now(), name: zoneName, active: true }; }
    return driverAPI.addZone(zoneName);
  },

  removeZone: async (id) => {
    if (USE_MOCK) { await delay(); return; }
    return driverAPI.removeZone(id);
  },

  // ── Véhicule ──
  getVehicle: async () => {
    if (USE_MOCK) { await delay(); return { type: "moto", brand: "Honda", model: "CG 125", plate: "BZV-1234", year: 2020 }; }
    return driverAPI.vehicle();
  },

  updateVehicle: async (data) => {
    if (USE_MOCK) { await delay(); return { ...data }; }
    return driverAPI.updateVehicle(data);
  },

  // ── Wallet ──
  getWallet: async () => {
    if (USE_MOCK) { await delay(); return { balance: 52800, pending: 7500, total_earned: 198000 }; }
    return driverAPI.wallet();
  },

  driverWithdraw: async (amount, method, phone) => {
    if (USE_MOCK) { await delay(600); return { success: true }; }
    return driverAPI.withdraw(amount, method, phone);
  },

  // ── Stats ──
  getStats: async (period = 'month') => {
    if (USE_MOCK) { await delay(); return D_STATS[period] || D_STATS.month; }
    return driverAPI.stats(period);
  },

  // ── Notifications ──
  getNotifications: async () => {
    if (USE_MOCK) { await delay(); return D_NOTIFS; }
    return driverAPI.dashboard(); // placeholder
  },
};
