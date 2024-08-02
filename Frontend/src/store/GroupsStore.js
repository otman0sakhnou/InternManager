import { create } from "zustand";

const useGroupStore = create((set, get) => ({
  idCounter: 1627903200000, // Initialize with a value that ensures uniqueness, or use a more sophisticated approach

  groups: [
    {
      id: 1627903200000,
      name: "Group A",
      description: "This is the first group",
      expirationDate: "2024-12-31",
      department: "PHP",
      stagiaires: [
        { id: 1, name: "Intern One" },
        { id: 2, name: "Intern Two" },
      ],
      collaborator: { id: 101, name: "John Doe" },
    },
    {
      id: 1627989600000,
      name: "Group B",
      description: "This is the second group",
      expirationDate: "2024-11-30",
      department: "PHP",
      stagiaires: [
        { id: 3, name: "Intern Three" },
        { id: 4, name: "Intern Four" },
      ],
      collaborator: { id: 102, name: "Jane Smith" },
    },
    {
      id: 1628076000000,
      name: "Group C",
      description: "This is the third group",
      expirationDate: "2024-10-31",
      department: "Java",
      stagiaires: [
        { id: 5, name: "Intern Five" },
        { id: 6, name: "Intern Six" },
      ],
      collaborator: { id: 103, name: "Alice Johnson" },
    },
  ],

  addGroup: (group) =>
    set((state) => {
      const newId = state.idCounter + 1; // Increment ID counter for new group
      return {
        groups: [...state.groups, { ...group, id: newId }],
        idCounter: newId, // Update ID counter
      };
    }),

  updateGroup: (id, updatedGroup) =>
    set((state) => {
      const updatedGroups = state.groups.map((group) =>
        group.id === id ? { ...group, ...updatedGroup } : group
      );

      return { groups: updatedGroups };
    }),

  deleteGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    })),

  getGroupById: (id) => {
    const { groups } = get();
    //the id from the param is received as string
    return groups.find((group) => group.id === Number(id)) || null;
  },

  getGroupsByDepartment: (department) => {
    const { groups } = get();
    return groups.filter((group) => group.department === department);
  },

  getGroupsByCollaboratorId: (collaboratorId) => {
    const { groups } = get();
    return groups.filter((group) => group.collaborator.id === collaboratorId);
  },

  getGroupsByInternId: (internId) => {
    const { groups } = get();
    return groups.filter((group) => group.stagiaires.some((intern) => intern.id === internId));
  },
}));

export default useGroupStore;
