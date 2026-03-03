/**
 * User Service — Adresses, Portefeuille, Coupons
 */
import { USE_MOCK, delay } from './config';
import { addressesAPI, walletsAPI, couponsAPI } from '../api';
import ADDRS from '../data/addresses';
import COUPONS from '../data/coupons';

const mockWallet = { balance: 45000, currency: "FCFA" };
const mockTransactions = [
  { id: "t1", type: "+", label: "Recharge Airtel", amount: 50000, date: "14 Fév", status: "success" },
  { id: "t2", type: "-", label: "Commande #LMK-0214", amount: 92000, date: "14 Fév", status: "success" },
  { id: "t3", type: "+", label: "Recharge MTN", amount: 100000, date: "10 Fév", status: "success" },
];

export default {
  // ── Adresses ──
  getAddresses: async () => {
    if (USE_MOCK) { await delay(); return ADDRS; }
    return addressesAPI.getAll();
  },
  createAddress: async (data) => {
    if (USE_MOCK) { await delay(); return { id: "a" + Date.now(), ...data }; }
    return addressesAPI.create(data);
  },
  updateAddress: async (id, data) => {
    if (USE_MOCK) { await delay(); return { id, ...data }; }
    return addressesAPI.update(id, data);
  },
  deleteAddress: async (id) => {
    if (USE_MOCK) { await delay(); return; }
    return addressesAPI.delete(id);
  },
  setDefaultAddress: async (id) => {
    if (USE_MOCK) { await delay(); return; }
    return addressesAPI.setDefault(id);
  },

  // ── Portefeuille ──
  getWalletBalance: async () => {
    if (USE_MOCK) { await delay(); return mockWallet; }
    return walletsAPI.getBalance();
  },
  topUp: async (amount, method, phone) => {
    if (USE_MOCK) { await delay(600); mockWallet.balance += amount; return { balance: mockWallet.balance }; }
    return walletsAPI.topup(amount, method, phone);
  },
  withdraw: async (amount, method, phone) => {
    if (USE_MOCK) { await delay(600); mockWallet.balance -= amount; return { balance: mockWallet.balance }; }
    return walletsAPI.withdraw(amount, method, phone);
  },
  getTransactions: async (type, page = 1) => {
    if (USE_MOCK) { await delay(); const items = type ? mockTransactions.filter(t => t.type === type) : mockTransactions; return { transactions: items, pagination: { page, total: items.length, has_more: false } }; }
    return walletsAPI.transactions(type, page);
  },

  // ── Coupons ──
  getCoupons: async () => {
    if (USE_MOCK) { await delay(); return COUPONS; }
    return couponsAPI.getAll();
  },
  verifyCoupon: async (code, subtotal) => {
    if (USE_MOCK) {
      await delay();
      const c = COUPONS.find(c => c.code === code);
      if (!c) throw new Error("Code promo invalide");
      if (subtotal < c.min) throw new Error(`Minimum ${c.min} FCFA requis`);
      return { valid: true, discount: c.discount, free_delivery: c.free || false };
    }
    return couponsAPI.verify(code, subtotal);
  },
};
