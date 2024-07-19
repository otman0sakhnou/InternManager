import AddCollaborator from "Admine/collaborator/addCollaborator";
import { create } from "zustand";

const useCollaboratorStore = create((set) => ({
  collaborators: [],
  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: [...state.collaborators, collaborator],
    })),
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
}));

export default useCollaboratorStore;