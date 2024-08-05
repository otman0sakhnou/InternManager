import { create } from "zustand";

const useCollaboratorStore = create((set, get) => ({
  idCounter: 4, // Start the counter from 1 or another appropriate value
  collaborators: [],
  addCollaborator: (collaborator) =>
    set((state) => {
      const newId = state.idCounter;
      const newCollaborator = { ...collaborator, id: newId };
      return {
        collaborators: [...state.collaborators, newCollaborator],
        idCounter: newId + 1, // Increment the counter
      };
    }),
  deleteCollaborator: (id) =>
    set((state) => ({
      collaborators: state.collaborators.filter((collaborator) => collaborator.id !== id),
    })),
  updateCollaborator: (updatedCollaborator) =>
    set((state) => ({
      collaborators: state.collaborators.map((collaborator) =>
        collaborator.id === updatedCollaborator.id ? updatedCollaborator : collaborator
      ),
    })),
  getCollaboratorById: (id) => get().collaborators.find((collaborator) => collaborator.id === id),
}));

export default useCollaboratorStore;
