import { create } from "zustand";

const useStagiaireStore = create((set) => ({
  stagiaires: [],
  nextId: 0,
  updateStagiaire: (updatedStagiaire) =>
    set((state) => ({
      stagiaires: state.stagiaires.map((stagiaire) =>
        stagiaire.id === updatedStagiaire.id ? updatedStagiaire : stagiaire
      ),
    })),

  addStagiaire: (stagiaire) =>
    set((state) => {
      const newStagiaire = { ...stagiaire, id: state.nextId };
      return {
        stagiaires: [...state.stagiaires, newStagiaire],
        nextId: state.nextId + 1,
      };
    }),

  deleteStagiaire: (id) =>
    set((state) => {
      const stagiaires = state.stagiaires.filter((stagiaire) => stagiaire.id !== id);
      return { stagiaires };
    }),
  deleteAllStagiaires: () =>
    set(() => ({
      stagiaires: [],
    })),
}));

export default useStagiaireStore;
