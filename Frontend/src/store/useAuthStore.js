import { create } from "zustand";
import * as authActions from "Actions/authActions";

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: false,
  roles: [], // Initialize as an empty array
  error: null,
  loading: false,

  setUser: (user) => set({ user, roles: user.roles, isAuthenticated: true }),

  setAccessToken: (newAccessToken) => {
    localStorage.setItem("accessToken", newAccessToken);
    set({ accessToken: newAccessToken, isAuthenticated: true });
  },

  login: async (loginData) => {
    set({ loading: true, error: null });
    try {
      const { accessToken: accessTokenLogged, refreshToken: refreshTokenLogged, user: userLogged, roles: rolesLogged } = await authActions.login(loginData);

      localStorage.setItem("accessToken", accessTokenLogged);
      localStorage.setItem("refreshToken", refreshTokenLogged);

      set({
        user: userLogged,
        accessToken: accessTokenLogged,
        refreshToken: refreshTokenLogged,
        roles: rolesLogged, // Store roles in state
        isAuthenticated: true,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      console.log("*******Loggging out")
      
      console.log(get().refreshToken);
      
      console.log(get().accessToken);
      await authActions.logout(get().refreshToken);
      console.log(get().refreshToken);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        roles: [], // Clear roles on logout
        isAuthenticated: false,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({
        error: error.response?.data?.message || "Logout failed",
        loading: false,
      });
    }
  },

  refreshToken: async () => {
    set({ loading: true, error: null });
    try {
      const { accessToken, refreshToken: newRefreshToken } = await authActions.refreshToken(
        get().refreshToken
      );

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      set({
        accessToken,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
        loading: false,
      });
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Refresh token error:", error);
      set({
        error: error.response?.data?.message || "Token refresh failed",
        loading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { message } = await authActions.forgotPassword(email);
      set({ error: null, loading: false });
      return message;
    } catch (error) {
      console.error("Forgot password error:", error);
      set({
        error: error.response?.data?.message || "Forgot password failed",
        loading: false,
      });
    }
  },

  resetPassword: async (resetData) => {
    set({ loading: true, error: null });
    try {
      const { message } = await authActions.resetPassword(resetData);
      set({ error: null, loading: false });
      return message;
    } catch (error) {
      console.error("Reset password error:", error);
      set({
        error: error.response?.data?.message || "Reset password failed",
        loading: false,
      });
    }
  },

  changeEmail: async (emailData) => {
    set({ loading: true, error: null });
    try {
      const { message } = await authActions.changeEmail(emailData);
      set({ error: null, loading: false });
      return message;
    } catch (error) {
      console.error("Change email error:", error);
      set({
        error: error.response?.data?.message || "Change email failed",
        loading: false,
      });
    }
  },

  confirmEmailChange: async (userId, email, token) => {
    set({ loading: true, error: null });
    try {
      const { message } = await authActions.confirmEmailChange(userId, email, token);
      set({ error: null, loading: false });
      return message;
    } catch (error) {
      console.error("Confirm email change error:", error);
      set({
        error: error.response?.data?.message || "Email confirmation failed",
        loading: false,
      });
    }
  },

  getRole: () => {
    const { roles } = get();
    return roles.length > 0 ? roles[0] : null; 
  },
}));

export default useAuthStore;
