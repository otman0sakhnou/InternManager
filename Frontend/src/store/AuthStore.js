import { create } from "zustand";

const useAuthStore = create((set) => ({
  role: "intern",
}));

export default useAuthStore;