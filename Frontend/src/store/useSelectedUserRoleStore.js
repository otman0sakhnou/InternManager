import { create } from "zustand";
import api from "services/axiosInstance";

const useSelectedUserRoleStore = create((set) => ({
  selectedUserRole: "",
  error: null,
  isLoading: false,

  fetchSelectedUserRole: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/roles/get-roles/${userId}`);
      const role = response.data[0];
      set({ selectedUserRole: role, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch role",
        isLoading: false,
      });
    }
  },

  fetchRolesByCollaboratorId: async (collaboratorId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/roles/collaborators/${collaboratorId}`);
      const role = response.data[0];
      set({ selectedUserRole: role, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch roles",
        isLoading: false,
      });
    }
  },

  fetchRolesByInternId: async (internId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/roles/interns/${internId}`);
      const role = response.data[0];
      set({ selectedUserRole: role, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch roles",
        isLoading: false,
      });
    }
  },
}));

export default useSelectedUserRoleStore;
