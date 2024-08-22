import {
  getAllCollaborators,
  getCollaboratorById,
  AddCollaborator,
  UpdateCollaborator,
  DeleteCollaborator
} from 'Actions/CollaboratorActions';
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
      collaborators: [...state.collaborators, newCollaborator]
    }));
  },
  updateCollaborator: async (id, collaborator) => {
    const updatedCollaborator = await UpdateCollaborator(id, collaborator);
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? updatedCollaborator : c
      )
    }));
  },
  deleteCollaborator: async (id) => {
    await DeleteCollaborator(id);
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== id)
    }));
  },
  getCollaborator: async (id) => {
    const res = await getCollaboratorById(id);
    return res
  }
}));

export default useCollaboratorStore;
