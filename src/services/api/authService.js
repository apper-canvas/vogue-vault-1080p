// Legacy auth service - authentication now handled by ApperUI/ApperSDK
// This service is maintained for backward compatibility
import store from "@/store";

const authService = {
  login: async (email, password) => {
    // Authentication is now handled by ApperUI
    throw new Error("Please use the login page for authentication");
  },

  register: async (userData) => {
    // Registration is now handled by ApperUI
    throw new Error("Please use the signup page for registration");
  },

  logout: async () => {
    // Logout is handled by ApperUI via the logout button
    return Promise.resolve();
  },

  getCurrentUser: () => {
    // Get user from Redux store instead of localStorage
    const state = store.getState();
    return state.user.user;
  },

  isAuthenticated: () => {
    const state = store.getState();
    return state.user.isAuthenticated;
  }
};

export default authService;