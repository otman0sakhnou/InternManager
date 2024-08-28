import {
  getAllCollaborators,
  getCollaboratorById,
  AddCollaborator,
  UpdateCollaborator,
  DeleteCollaborator,
  getCollaboratorIdByUserId,
} from "Actions/CollaboratorActions";
import { create } from "zustand";

const useCollaboratorStore = create((set, get) => ({
  collaborators: [],

  getCollaborators: async () => {
    const data = await getAllCollaborators();
    set({ collaborators: data });
  },
  addCollaborator: async (collaborator) => {
    const newCollaborator = await AddCollaborator(collaborator);
    set((state) => ({
      collaborators: [...state.collaborators, newCollaborator],
    }));
  },
  updateCollaborator: async (id, collaborator) => {
    const updatedCollaborator = await UpdateCollaborator(id, collaborator);
    set((state) => ({
      collaborators: state.collaborators.map((c) => (c.id === id ? updatedCollaborator : c)),
    }));
  },
  deleteCollaborator: async (id) => {
    await DeleteCollaborator(id);
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== id),
    }));
  },
  getCollaborator: async (id) => {
    const res = await getCollaboratorById(id);
    return res;
  },
  getCollaboratorByUserId: async (userId) => {
    try {
      const collaboratorId = await getCollaboratorIdByUserId(userId);
      console.log(collaboratorId);
      if (collaboratorId) {
        const collaborator = await get().getCollaborator(collaboratorId);
        console.log(collaborator);
        return collaborator;
      }
      throw new Error("Collaborator not found for the given user ID.");
    } catch (error) {
      console.error("Error fetching collaborator by userId:", error);
      throw error;
    }
  },
}));

export default useCollaboratorStore;
