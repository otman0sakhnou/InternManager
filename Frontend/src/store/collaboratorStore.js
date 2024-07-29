import AddCollaborator from "Admine/collaborator/addCollaborator";
import { create } from "zustand";

const useCollaboratorStore = create((set) => ({
  collaborators: [
    {
      id: Date.now() + 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "123-456-7890",
      job: "manager",
      department: "Java",
      organization: "Acme Corp",
      employementDate: "2024-01-15",
      password: "password123",
      confirmPassword: "password123",
    },
    {
      id: Date.now() + 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "987-654-3210",
      job: "collaborator",
      department: "PHP",
      organization: "Beta LLC",
      employementDate: "2023-07-01",
      password: "securepassword",
      confirmPassword: "securepassword",
    },
    {
      id: Date.now() + 3,
      name: "Carol Davis",
      email: "carol.davis@example.com",
      phone: "555-555-5555",
      job: "manager",
      department: "Java",
      organization: "Gamma Inc",
      employementDate: "2022-11-22",
      password: "mypassword",
      confirmPassword: "mypassword",
    },
  ],
  addCollaborator: (collaborator) =>
    set((state) => {
      const newCollaborator = {
        ...collaborator,
        id: Date.now(),
      };
      return {
        collaborators: [...state.collaborators, newCollaborator],
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
}));

export default useCollaboratorStore;
