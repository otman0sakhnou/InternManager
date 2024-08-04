import dayjs from "dayjs";
import { create } from "zustand";


const useStagiaireStore = create((set, get) => ({
  stagiaires: [
    {
      id: 0,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      gender: "male",
      educationInfo: {
        institution: "University of Example",
        level: "Bachelor",
        specialization: "Computer Science",
        yearOfStudy: "3rd Year",
      },
      internshipInfo: {
        title: "Software Developer Intern",
        department: "IT",
        startDate: "2024-06-01",
        endDate: "2024-09-01",
      },
    },
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      gender: "female",
      educationInfo: {
        institution: "Example State University",
        level: "Master",
        specialization: "Data Science",
        yearOfStudy: "1st Year",
      },
      internshipInfo: {
        title: "Data Analyst Intern",
        department: "Data Science",
        startDate: "2024-06-15",
        endDate: "2024-09-15",
      },
    },
    {
      id: 2,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-123-4567",
      gender: "female",
      educationInfo: {
        institution: "Tech University",
        level: "Bachelor",
        specialization: "Information Technology",
        yearOfStudy: "4th Year",
      },
      internshipInfo: {
        title: "Network Engineer Intern",
        department: "Networking",
        startDate: "2024-07-01",
        endDate: "2024-10-01",
      },
    },
  ],
  nextId: 3,
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
  
  getStagiaireById: (id) => get().stagiaires.find((stagiaire) => stagiaire.id === id)
}));

export default useStagiaireStore;
