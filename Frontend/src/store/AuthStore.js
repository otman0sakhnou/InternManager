import { create } from "zustand";

const useAuthStore = create((set) => ({
  role: "collaborator",
}));

export default useAuthStore;