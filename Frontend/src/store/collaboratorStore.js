import { create } from "zustand";

const useCollaboratorStore = create((set, get) => ({
  idCounter: 4, // Start the counter from 1 or another appropriate value
  collaborators: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "123-456-7890",
      gender: "female",
      job: "manager",
      department: "Java",
      organization: "Acme Corp",
      employementDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "987-654-3210",
      gender: "male",
      job: "collaborator",
      department: "PHP",
      organization: "Beta LLC",
      employementDate: "2023-07-01",
      password: "securepassword",
      confirmPassword: "securepassword",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@example.com",
      phone: "555-555-5555",
      gender: "female",
      job: "manager",
      department: "Java",
      organization: "Gamma Inc",
      employementDate: "2022-11-22",
    },
  ],
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
