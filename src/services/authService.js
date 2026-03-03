/**
 * Auth & User Profile Service
 */
import { USE_MOCK, delay } from './config';
import { authAPI, usersAPI } from '../api';

const mockUser = {
  id: 1, first_name: "Joeldy", last_name: "Tsina",
  phone: "+242064663469", email: "joeldytsina94@gmail.com",
  avatar: null, lang: "fr", role: "client",
  vendor_status: "active", driver_status: "none",
};

export default {
  sendOTP: async (phone) => {
    if (USE_MOCK) { await delay(); return { success: true }; }
    return authAPI.sendOTP(phone);
  },

  verifyOTP: async (phone, code) => {
    if (USE_MOCK) {
      await delay(500);
      if (code.length < 4) throw new Error("Code invalide");
      return { token: "mock_jwt_" + Date.now(), user: mockUser, is_new: false };
    }
    return authAPI.verifyOTP(phone, code);
  },

  social: async (provider, providerId, email, name, avatar) => {
    if (USE_MOCK) { await delay(); return { token: "mock_social_" + Date.now(), user: { ...mockUser, first_name: name?.split(" ")[0], email, avatar }, is_new: false }; }
    return authAPI.social(provider, providerId, email, name, avatar);
  },

  completeProfile: async (data) => {
    if (USE_MOCK) { await delay(); return { ...mockUser, ...data }; }
    return authAPI.completeProfile(data);
  },

  getMe: async () => {
    if (USE_MOCK) { await delay(); return mockUser; }
    return usersAPI.me();
  },

  updateProfile: async (data) => {
    if (USE_MOCK) { await delay(); return { ...mockUser, ...data }; }
    return usersAPI.update(data);
  },

  updatePassword: async (pwd) => {
    if (USE_MOCK) { await delay(); return { success: true }; }
    return usersAPI.updatePassword(pwd);
  },

  uploadAvatar: async (file) => {
    if (USE_MOCK) { await delay(); return { avatar: URL.createObjectURL(file) }; }
    return usersAPI.uploadAvatar(file);
  },

  logout: async () => {
    if (USE_MOCK) return;
    return authAPI.logout();
  },
};
