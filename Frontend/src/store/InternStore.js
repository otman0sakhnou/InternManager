
import { create } from "zustand";

import {
  fetchAllInterns,
  fetchInternById,
  createIntern,
  updateIntern,
  deleteIntern,
  deleteAllInterns,
} from '../Actions/InternsActions';
const useStagiaireStore = create((set, get) => ({
  stagiaires: [],
  //   nextId: 3,
  //   updateStagiaire: (updatedStagiaire) =>
  //     set((state) => ({
  //       stagiaires: state.stagiaires.map((stagiaire) =>
  //         stagiaire.id === updatedStagiaire.id ? updatedStagiaire : stagiaire
  //       ),
  //     })),

  //   addStagiaire: (stagiaire) =>
  //     set((state) => {
  //       const newStagiaire = { ...stagiaire, id: state.nextId };
  //       return {
  //         stagiaires: [...state.stagiaires, newStagiaire],
  //         nextId: state.nextId + 1,
  //       };
  //     }),

  //   deleteStagiaire: (id) =>
  //     set((state) => {
  //       const stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.id !== id);
  //       return { stagiaires };
  //     }),
  //   deleteAllStagiaires: () =>
  //     set(() => ({
  //       stagiaires: [],
  //     })),

  //   getStagiaireById: (id) => get().stagiaires.find((stagiaire) => stagiaire.id === id)
  loadInterns: async () => {
    const interns = await fetchAllInterns();
    set({ stagiaires: interns });
  },
  addStagiaire: async (internData) => {
    const newIntern = await createIntern(internData);
    set((state) => ({
      stagiaires: [...state.stagiaires, newIntern],
    }));
  },
  updateStagiaire: async (internData) => {
    await updateIntern(internData);
    set((state) => ({
      stagiaires: state.stagiaires.map((intern) =>
        intern.id === internData.id ? internData : intern
      ),
    }));
  },

  deleteStagiaire: async (id) => {
    await deleteIntern(id);
    set((state) => ({
      stagiaires: state.stagiaires.filter((intern) => intern.id !== id),
    }));
  },

  deleteAllStagiaires: async () => {
    await deleteAllInterns();
    set({ stagiaires: [] });
  },

  getStagiaireById: (id) => {
    const intern = get().stagiaires.find((intern) => intern.id === id);
    if (!intern) {
      return fetchInternById(id);
    }
    return intern;
  },
}));

export default useStagiaireStore;
